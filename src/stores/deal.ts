import { ref, type Ref } from "vue";
import { acceptHMRUpdate, defineStore } from "pinia";
import type { ProductType } from "@/types/ProductType";
import type { ResponseType } from "@/types/ResponseType";
import {
	getSpecialProducts,
	getProductsDeals,
	getProductsExperience
} from "@/services/DealService";

/**
 * Store de Pinia de la vista Deals: productos especiales, ofertas destacadas y
 * productos de la sección "food experience".
 */
export const useDealStore = defineStore("deal", () => {
	const specialProducts: Ref<ProductType[]> = ref<ProductType[]>([]);
	const productsDeals: Ref<ProductType[]> = ref<ProductType[]>([]);
	const productsExperience: Ref<ProductType[]> = ref<ProductType[]>([]);
	const error: Ref<string> = ref<string>(null);

	/**
	 * Carga los productos especiales desde `DealService.getSpecialProducts`.
	 * Si la respuesta indica fallo, deja `specialProducts` sin modificar y
	 * guarda el mensaje en `error`.
	 */
	async function loadSpecialProducts() {
		const response: ResponseType<ProductType[]> = await getSpecialProducts();

		if (!response.success) {
			error.value = response.message;
			return;
		}

		specialProducts.value = response.data;
	}

	/**
	 * Carga las ofertas/deals desde `DealService.getProductsDeals`.
	 * Si la respuesta indica fallo, deja `productsDeals` sin modificar y
	 * guarda el mensaje en `error`.
	 */
	async function loadProductsDeals() {
		const response: ResponseType<ProductType[]> = await getProductsDeals();

		if (!response.success) {
			error.value = response.message;
			return;
		}

		productsDeals.value = response.data;
	}

	/**
	 * Carga los productos de "food experience" desde `DealService.getProductsExperience`.
	 * Si la respuesta indica fallo, deja `productsExperience` sin modificar y
	 * guarda el mensaje en `error`.
	 */
	async function loadProductsExperience() {
		const response: ResponseType<ProductType[]> = await getProductsExperience();

		if (!response.success) {
			error.value = response.message;
			return;
		}

		productsExperience.value = response.data;
	}

	return {
		specialProducts,
		productsDeals,
		productsExperience,
		error,
		loadSpecialProducts,
		loadProductsDeals,
		loadProductsExperience
	};
});

// Enable hot module
if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useDealStore, import.meta.hot));
}
