import httpClient from "@/http";
import type { ResponseType } from "@/types/ResponseType";
import type { CategoryType } from "@/types/CategoryType";

/**
 * Obtiene todas las categorías del menú (usadas para filtrar y organizar el catálogo de productos).
 *
 * @returns Promesa con el contrato estándar `ResponseType`, cuyo `data` es la lista de {@link CategoryType}.
 */
export const getAllCategories = (): Promise<ResponseType<CategoryType[]>> => {
  return httpClient.get("/categories");
};
