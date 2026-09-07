import axios from "axios";
import router from "@/router";
import useMock from "@/mocks/Adapter";

/**
 * Cliente Axios único de la aplicación. Todas las llamadas de `src/services`
 * pasan por esta instancia, que centraliza timeout, headers y manejo de errores.
 *
 * `baseURL` está sin configurar deliberadamente: sin ella, y con el mock adapter
 * activo (ver `useMock` más abajo), todas las peticiones son interceptadas y
 * respondidas localmente sin salir a la red.
 */
const httpClient = axios.create({
	// baseURL: "add your env variable right here to connect with the API",
	timeout: 5000
});

/**
 * Interceptor de request. Punto de extensión para adjuntar headers comunes
 * (p. ej. `Authorization: Bearer <token>`) antes de enviar cualquier petición.
 * Actualmente no modifica la request.
 */
httpClient.interceptors.request.use(async (request) => {
	// You can modify the request config here, so you can add headers with the access token for instance.
	// request.headers.Authorization = `Bearer ${accessToken}`;
	return request;
});

/**
 * Interceptor de response. Normaliza toda respuesta 2xx devolviendo directamente
 * `response.data` (el contrato `ResponseType<T>`), y ante cualquier respuesta
 * fuera de 2xx redirige a la página de error correspondiente (`/error/:status`)
 * y rechaza la promesa con el payload de error del backend/mock.
 *
 * @throws Rechaza la promesa con `error.response.data` cuando el status HTTP no está en el rango 2xx.
 */
httpClient.interceptors.response.use(
	(response) => {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Right here you can parse the response and convert it to a standard type.
		return response.data;
	},
	(error) => {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// As we're using a standard for API response using ResponseType, right here we should pass just the response data as error to the custom error page
		const response = error.response.data;
		const status = error.response.status;

		router.push(`/error/${status}`);
		return Promise.reject(response);
	}
);

/**
 * Cliente HTTP exportado por el módulo, envuelto por `useMock` para que,
 * mientras no exista una API real configurada, todos los endpoints del
 * catálogo/checkout respondan desde `axios-mock-adapter`.
 */
export default useMock(httpClient);
