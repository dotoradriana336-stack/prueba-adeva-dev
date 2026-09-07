import httpClient from "@/http";
import type { ResponseType } from "@/types/ResponseType";
import type { ProductType } from "@/types/ProductType";

/**
 * Envía el carrito de compras para completar (simular) la compra.
 *
 * @param products - Productos actualmente en el carrito del checkout.
 * @returns Promesa con el contrato estándar `ResponseType`; `data` es `void` — no se espera payload de retorno.
 */
export const checkoutCompletePurchase = (products: ProductType[]): Promise<ResponseType<void>> => {
	return httpClient.post("/purchase", products);
};
