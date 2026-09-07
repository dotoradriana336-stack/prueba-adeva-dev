import { ref, type Ref } from "vue";
import { acceptHMRUpdate, defineStore } from "pinia";
import { getAllProducts, getProductBySlug, getSuggestedProducts } from "@/services/ProductService";
import type { ProductType } from "@/types/ProductType";
import type { ResponseType } from "@/types/ResponseType";

/**
 * Store de Pinia del catálogo y detalle de productos: listado completo del menú,
 * producto seleccionado para la vista de detalle y productos sugeridos/relacionados.
 */
export const useProductStore = defineStore("product", () => {
	const preferredProduct: Ref<ProductType> = ref<ProductType>(null);
	const suggestedProducts: Ref<ProductType[]> = ref<ProductType[]>([]);
	const products: Ref<ProductType[]> = ref<ProductType[]>([]);
	const error: Ref<string> = ref<string>(null);

	/**
	 * Carga el catálogo completo desde `ProductService.getAllProducts`.
	 * Si la respuesta indica fallo, deja `products` sin modificar y guarda
	 * el mensaje en `error`.
	 */
	async function loadProducts() {
		const response: ResponseType<ProductType[]> = await getAllProducts();

		if (!response.success) {
			error.value = response.message;
			return;
		}

		products.value = response.data;
	}

	/**
	 * Carga el producto de la vista de detalle a partir de su slug, vía
	 * `ProductService.getProductBySlug`. Si la respuesta indica fallo, deja
	 * `preferredProduct` sin modificar y guarda el mensaje en `error`.
	 *
	 * @param slug - Slug del producto a cargar.
	 */
	async function loadPreferredProduct(slug: string) {
		const response: ResponseType<ProductType> = await getProductBySlug(slug);

		if (!response.success) {
			error.value = response.message;
			return;
		}

		preferredProduct.value = response.data;
	}

	/**
	 * Carga los productos sugeridos/relacionados desde `ProductService.getSuggestedProducts`.
	 * Si la respuesta indica fallo, deja `suggestedProducts` sin modificar y
	 * guarda el mensaje en `error`.
	 */
	async function loadSuggestedProducts() {
		const response: ResponseType<ProductType[]> = await getSuggestedProducts();

		if (!response.success) {
			error.value = response.message;
			return;
		}

		suggestedProducts.value = response.data;
	}

	return {
		preferredProduct,
		products,
		suggestedProducts,
		error,
		loadPreferredProduct,
		loadProducts,
		loadSuggestedProducts
	};
});

// Enable hot module
if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
