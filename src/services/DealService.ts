import httpClient from "@/http";
import type { ResponseType } from "@/types/ResponseType";
import type { ProductType } from "@/types/ProductType";

/**
 * Obtiene los productos listados como ofertas/deals para la vista de Deals.
 *
 * @returns Promesa con el contrato estándar `ResponseType`, cuyo `data` es la lista de {@link ProductType}.
 */
export const getProductsDeals = (): Promise<ResponseType<ProductType[]>> => {
  return httpClient.get("/deals");
};

/**
 * Obtiene los productos marcados como especiales (platos especiales de la sección Deals).
 *
 * @returns Promesa con el contrato estándar `ResponseType`, cuyo `data` es la lista de {@link ProductType}.
 */
export const getSpecialProducts = (): Promise<ResponseType<ProductType[]>> => {
  return httpClient.get("/deals/special");
};

/**
 * Obtiene los productos destacados para la sección "food experience" de Deals.
 *
 * @returns Promesa con el contrato estándar `ResponseType`, cuyo `data` es la lista de {@link ProductType}.
 */
export const getProductsExperience = (): Promise<ResponseType<ProductType[]>> => {
  return httpClient.get("/deals/experience");
};

/**
 * Obtiene el producto del día destacado en Deals.
 *
 * @returns Promesa con el contrato estándar `ResponseType`, cuyo `data` es un único {@link ProductType}.
 */
export const getDailyProduct = (): Promise<ResponseType<ProductType>> => {
  return httpClient.get("/deals/daily");
};

/**
 * Obtiene el producto resaltado ("highlighted") de la sección Deals.
 *
 * @returns Promesa con el contrato estándar `ResponseType`, cuyo `data` es un único {@link ProductType}.
 */
export const getHighlightedProduct = (): Promise<ResponseType<ProductType>> => {
  return httpClient.get("/deals/highlighted");
};
