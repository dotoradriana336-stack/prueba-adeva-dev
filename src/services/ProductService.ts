import httpClient from "@/http";
import type { ResponseType } from "@/types/ResponseType";
import type { ProductType } from "@/types/ProductType";

/**
 * Obtiene el catálogo completo de productos del menú.
 *
 * @returns Promesa con el contrato estándar `ResponseType`, cuyo `data` es la lista de {@link ProductType}.
 */
export const getAllProducts = (): Promise<ResponseType<ProductType[]>> => {
  return httpClient.get("/products");
};

/**
 * Obtiene los productos sugeridos, usados como "related products" en la vista de detalle.
 *
 * @returns Promesa con el contrato estándar `ResponseType`, cuyo `data` es la lista de {@link ProductType}.
 */
export const getSuggestedProducts = (): Promise<ResponseType<ProductType[]>> => {
  return httpClient.get("/suggested/products");
};

/**
 * Obtiene el detalle de un producto a partir de su slug (identificador legible en URL).
 *
 * @param slug - Slug único del producto (p. ej. el segmento de la ruta `/product/:slug`).
 * @returns Promesa con el contrato estándar `ResponseType`, cuyo `data` es un único {@link ProductType}.
 */
export const getProductBySlug = (slug: string): Promise<ResponseType<ProductType>> => {
  return httpClient.get(`/products/${slug}`);
};
