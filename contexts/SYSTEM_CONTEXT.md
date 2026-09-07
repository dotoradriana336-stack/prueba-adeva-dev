# SYSTEM_CONTEXT.md
<!-- Generado por adeva-system-context -->
<!-- Última actualización: 2026-09-07 -->
<!-- Revisión del repositorio: 4242d64 (+ cambios locales sin commitear: configuración de Vitest, docstrings JSDoc en src/http, src/services, src/stores, src/utils, y fix de bug en category/deal/product stores) -->
<!-- Niveles de provenance: explícito | observado | inferido | desconocido -->
<!-- Este archivo es un contexto consolidado, no la fuente de verdad del proyecto.
     Para verificar una afirmación, consulta las fuentes primarias en la sección Fuentes del Proyecto. -->

## Descripción del Sistema
<!-- provenance: explícito -->
Restaurant Menu es una SPA de Vue 3 + TypeScript + Vite que simula la experiencia de un menú de restaurante con delivery: catálogo, ofertas, detalle de producto y checkout. Su propósito declarado (README) es servir como proyecto de referencia de patrones y buenas prácticas de Vue 3, no como producto en producción.

## Dominio del Negocio
<!-- provenance: explícito -->
**Dominio:** E-commerce de restaurante / delivery de comida.
**Contexto:** Catálogo de productos (menú) organizado por categorías, ofertas/deals destacadas, ficha de producto con ingredientes y reseñas, y checkout con simulación de pago. No hay backend real: todo corre contra datos mock salvo que se configure una API externa.

## Actores
<!-- provenance: inferido -->
<!-- fuente: estructura de módulos (src/views), ausencia de lógica de roles en el código -->
- **Cliente/visitante:** único actor identificado. Navega el menú, arma un carrito y completa (simula) el checkout. No hay evidencia de roles administrativos, autenticación de usuario ni panel de gestión.

## Funcionalidades Principales
<!-- provenance: explícito -->
<!-- fuente: README.md -->
1. Deals — welcome intro, platos especiales, acceso rápido por categoría, great deals, food experience.
2. Menu — listado de productos, búsqueda por nombre, filtro por categoría, orden (reviews, precio, calorías, nombre).
3. Product — detalle, ingredientes, resumen de reviews, items adicionales, comentarios, productos relacionados.
4. Checkout — revisión del carrito, eliminar ítem, datos de pago/entrega, simulación de pago.
5. Error — páginas Not Found y Server.

## Reglas de Negocio
<!-- provenance: observado -->
<!-- fuente: src/http/index.ts, src/services/*.ts, src/types/ResponseType.ts -->
- **RN-01:** Toda respuesta HTTP se ajusta al contrato `ResponseType<T> { success, message?, data? }`.
- **RN-02:** Ante una respuesta HTTP fuera del rango 2xx, el interceptor redirige automáticamente a `/error/:status` y rechaza la promesa con el payload de error — no hay manejo de error local por servicio o componente.
- **RN-03:** Los módulos de `src/services` no contienen lógica de negocio: son funciones puras que mapean un endpoint REST a una firma tipada.

<!-- COMPLETAR: no hay ADR, especificación ni ticket que confirme estas reglas como decisión de producto explícita — están evidenciadas solo por el código. -->

## Estados del Sistema
<!-- provenance: desconocido -->
<!-- COMPLETAR: no se identificó una máquina de estados formal. El checkout usa un estado local `CheckoutStateType = "delivery" | "payment"` (src/types/CheckoutType.ts) pero no hay evidencia de transiciones ni persistencia entre sesiones. -->

## Integraciones Externas
<!-- provenance: observado -->
<!-- fuente: src/http/index.ts, src/mocks/Adapter, firebase.json -->
| Sistema | Tipo | Propósito | Notas |
|---------|------|-----------|-------|
| API REST (sin especificar) | REST | Backend de catálogo/checkout | No conectado por defecto; el `baseURL` del cliente Axios está sin configurar (comentario en el código invita a añadirlo) |
| axios-mock-adapter | Librería / interceptor local | Simula todos los endpoints (`/categories`, `/products`, `/deals*`, `/purchase`, etc.) cuando no hay API real | Activo por defecto vía `useMock(httpClient)` |
| Firebase Hosting | Deploy estático | Servir el build (`dist`) como SPA | Solo hosting — `firebase.json` no declara Functions ni Firestore |

## Contratos
<!-- provenance: observado -->
<!-- fuente: src/types/ResponseType.ts, src/services/*.ts -->
- **Visibilidad:** API interna al proyecto (consumida solo por los propios servicios/stores del frontend).
- **Versionado:** <!-- COMPLETAR --> sin evidencia de versionado de API.
- **Contratos de eventos:** N/A — no hay mensajería/eventos externos.
- **Schemas compartidos:** `src/types/` (`ResponseType`, `ProductType`, `CategoryType`, `CheckoutType`, `ListType`).
- **Consumidores relevantes:** Los stores de Pinia (`src/stores`) y las vistas (`src/views`) que invocan los servicios.
- **Compatibilidad requerida:** <!-- COMPLETAR: sin backend real ni consumidores externos, no hay política de breaking changes declarada -->

## Arquitectura
<!-- provenance: observado -->
<!-- fuente: estructura de carpetas src/, README.md -->
**Estilo:** SPA modular en capas (componentes / vistas / stores / services / http) sobre Vue 3 + Composition API.
**Capas:**
- `src/http` — cliente Axios único con interceptores de request/response centralizados (manejo de errores estandarizado, mock adapter).
- `src/services` — funciones de acceso a datos, una por dominio (Category, Product, Deal, Checkout), sin lógica de negocio.
- `src/stores` (Pinia, setup stores) — estado y efectos secundarios que invocan los servicios.
- `src/views` / `src/components` — capa de presentación: vistas "smart" que centralizan eventos y componentes "dumb" que solo muestran datos y emiten eventos.
- `src/router` — guard de checkout, scroll behavior, lazy loading de módulos, catch-all de rutas no encontradas.
- `src/types` — contratos de datos compartidos entre servicios, stores y componentes.
**Convenciones:** Composition API sobre Options API; Pinia setup stores sobre option stores; separación estricta smart/dumb component; utilidades y servicios para encapsular lógica repetida (README).
**Decisiones relevantes:** <!-- COMPLETAR: no hay ADRs en el repositorio; las decisiones de arquitectura solo están documentadas de forma narrativa en README.md -->

## Stack Tecnológico
<!-- provenance: observado -->
<!-- fuente: package.json, vite.config.ts, tsconfig*.json -->
- **Lenguaje:** TypeScript ~5.0.4
- **Framework:** Vue 3.3.x (Composition API) + Vite 4.3.x
- **Base de datos:** N/A — no hay persistencia backend en el repo
- **ORM / Query builder:** N/A
- **Testing:** Vitest 0.34.6 + @vue/test-utils 2.4.6 + happy-dom (entorno DOM) + @vitest/coverage-v8 (cobertura). Pruebas unitarias para `src/http`, `src/services`, `src/stores` y `src/utils`; aún no hay pruebas de componentes/vistas ni e2e.
- **Infraestructura:** Firebase Hosting (estático)
- **CI/CD:** <!-- COMPLETAR: no se encontró carpeta .github/workflows ni otra configuración de CI/CD en el repositorio -->
- **Otras dependencias clave:** Pinia 2.0.x, Vuelidate 2.x, Axios 1.6.x + axios-mock-adapter, Vue Router 4.2.x, Sass, ESLint + Prettier, Maska (input masking)

## Flujo Principal
<!-- provenance: explícito -->
<!-- fuente: README.md, src/router, src/services/CheckoutService.ts -->
1. El usuario entra a Deals o Menu y explora el catálogo (filtros de categoría, búsqueda, orden).
2. Abre el detalle de un producto (ingredientes, reviews, adicionales, relacionados).
3. Agrega productos al carrito.
4. Entra a Checkout: revisa/edita el carrito, completa datos de entrega y pago.
5. Se invoca `checkoutCompletePurchase` (`POST /purchase`), simulando el pago — no hay pasarela real.
6. Cualquier error HTTP en el camino redirige a `/error/:status` vía el interceptor global.

## Deployment
<!-- provenance: observado -->
<!-- fuente: firebase.json, package.json (script "deploy") -->
- **Estrategia:** Deploy estático directo (`firebase deploy`) del build (`dist`) generado por `vite build`.
- **Entornos:** <!-- COMPLETAR: no hay diferenciación explícita de entornos (dev/staging/prod) más allá del build local vs. Firebase Hosting -->
- **Consideraciones:** SPA rewrite configurado (`**` → `/index.html`); no hay migraciones ni feature flags (no aplica, sin backend).

## Reglas de Seguridad
<!-- provenance: observado -->
<!-- fuente: src/http/index.ts -->
- **Autenticación:** No implementada. El hook para adjuntar `Authorization: Bearer` está presente en el interceptor de request pero comentado/inactivo.
- **Autorización:** <!-- COMPLETAR: sin evidencia de ningún modelo de autorización -->
- **Datos sensibles:** El formulario de pago captura `cardNumber`, `cvv`, `expiryDate`, `holderName` (`src/types/CheckoutType.ts`) — no hay evidencia de tokenización, encriptación ni de que estos datos salgan del mock local.
- **Restricciones específicas:** <!-- COMPLETAR -->

## Restricciones
<!-- provenance: observado -->
- Proyecto de referencia/aprendizaje, no pensado para producción real (README y ausencia de auth/tests lo confirman).
- No hay suite de tests automatizada — cualquier cambio depende de verificación manual o de type-check (`vue-tsc`) y lint.
- El checkout es una simulación: no hay integración con una pasarela de pago real.

## Control de Versiones
<!-- provenance: desconocido -->
<!-- fuente: sin CONTRIBUTING.md, sin commitlint.config.*, sin .github/ -->
- **Commit convention:** <!-- COMPLETAR --> El repositorio tiene un único "Initial commit"; no hay evidencia de convención (Conventional Commits ni otra).
- **Allowed types:** <!-- COMPLETAR -->
- **Scopes:** <!-- COMPLETAR -->
- **Breaking changes:** <!-- COMPLETAR -->
- **Branch pattern:** <!-- COMPLETAR --> (rama actual: `main`)
- **Protected branches:** <!-- COMPLETAR -->
- **Merge strategy:** <!-- COMPLETAR -->
- **Header max length:** <!-- COMPLETAR -->
- **Changelog:** <!-- COMPLETAR --> no existe `CHANGELOG.md` en el repositorio.
- **Changelog audience:** <!-- COMPLETAR -->
- **Versioning:** `package.json` declara `0.0.1`; sin evidencia de que se siga SemVer de forma activa.

## Fuentes del Proyecto
<!-- provenance: observado -->
- **Arquitectura:** `README.md` (sección "Vue 3 Approaches" / "Application Modules") — no hay `docs/adr/`.
- **API / Contratos:** `src/types/`, `src/services/`, `src/mocks/Adapter` (mocks) — no hay `openapi/`/`swagger/`.
- **Base de datos:** N/A.
- **Seguridad:** N/A — sin `docs/security/`.
- **Deployment:** `firebase.json`, `package.json` (script `deploy`).
- **Testing:** `vitest.config.ts`, scripts `test`/`test:watch`/`test:coverage` en `package.json`. Specs junto al código fuente (`src/**/*.spec.ts`).
- **Reglas de negocio:** Código observado en `src/http` y `src/services` (ver sección Reglas de Negocio).
- **Control de versiones:** N/A — no hay `CONTRIBUTING.md` ni configuración de commits.

## Consideraciones Importantes
<!-- provenance: observado -->
- Cobertura de pruebas unitarias limitada al núcleo lógico (`src/http`, `src/services`, `src/stores`, `src/utils`) — 13 archivos de test, 91 casos, 100% de cobertura de statements/branches/funcs/lines en esas 4 capas. Componentes, vistas, router y `src/mocks` no tienen pruebas todavía; extenderla es la continuación natural de este trabajo.
- Deuda técnica resuelta (ver `reports/adeva-tech-debt/local-2026-09-07-2026-09-07.md`): `axios` y sus transitivas (`form-data`, `follow-redirects`) y las transitivas del toolchain de Vite (`nanoid`, `postcss`, `svgo`) actualizadas vía `npm audit fix` (sin `--force`, dentro de los rangos semver ya declarados). Quedan pendientes, deliberadamente, las que requieren `--force` (`vite`→8, `happy-dom`→20, `vitest`→5) por ser majors — ver el ítem 🟢 del reporte de deuda técnica.
- Bug corregido durante la generación de pruebas: `useCategoryStore`, `useDealStore` y `useProductStore` declaraban un `error: Ref<string>` interno que nunca se exponía en el objeto retornado por `defineStore(...)`, por lo que `store.error` siempre era `undefined` para cualquier vista o componente que lo consumiera (a diferencia de `useCheckoutStore`, que sí lo exponía). Se agregó `error` al `return` de los tres stores.
- No hay pipeline de CI/CD — `adeva-cicd-diagnosis` no tiene un pipeline real sobre el cual operar hasta que se configure uno. Con Vitest ya configurado, un pipeline de CI podría ejecutar `npm run test`, `npm run type-check` y `npm run lint` en cada PR.
- El proyecto es explícitamente educativo/demo (README); hallazgos de seguridad (ausencia de auth, datos de tarjeta sin protección) deben reportarse como deuda esperada de un proyecto de referencia, no como incidentes críticos de producción, salvo que el usuario indique lo contrario.

## Conflictos de Contexto
<!-- Sin conflictos: generación inicial, no había SYSTEM_CONTEXT.md previo -->
