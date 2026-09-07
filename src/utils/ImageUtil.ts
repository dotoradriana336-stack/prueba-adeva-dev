/**
 * Resuelve la URL de un asset arbitrario bajo `src/` usando resolución dinámica
 * de Vite (`new URL(..., import.meta.url)`), necesaria para que el bundler
 * incluya el archivo cuando la ruta no es estática en tiempo de build.
 *
 * @param asset - Ruta del asset relativa a `src/` (p. ej. `"assets/logo.png"`).
 * @returns La URL resuelta del asset.
 */
export const loadDynamicAsset = (asset: string) => {
	return new URL(`/src/${asset}`, import.meta.url).href;
};

/**
 * Resuelve la URL de una imagen PNG dentro de `src/assets/{path}/{image}.png`.
 *
 * @param path - Subcarpeta dentro de `src/assets` donde vive la imagen.
 * @param image - Nombre del archivo sin extensión.
 * @returns La URL resuelta de la imagen.
 */
export const loadDynamicImage = (path: string, image: string) => {
	return new URL(`/src/assets/${path}/${image}.png`, import.meta.url).href;
};

/**
 * Resuelve la URL de un ícono SVG dentro de `src/assets/{path}/{svg}.svg`.
 *
 * @param path - Subcarpeta dentro de `src/assets` donde vive el SVG.
 * @param svg - Nombre del archivo sin extensión.
 * @returns La URL resuelta del SVG.
 */
export const loadDynamicSvg = (path: string, svg: string) => {
	return new URL(`/src/assets/${path}/${svg}.svg`, import.meta.url).href;
};
