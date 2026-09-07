import { ref, type Ref } from "vue";
import { acceptHMRUpdate, defineStore } from "pinia";
import { getAllCategories } from "@/services/CategoryService";
import type { CategoryType } from "@/types/CategoryType";
import type { ResponseType } from "@/types/ResponseType";

/**
 * Store de Pinia para las categorías del menú: catálogo de categorías disponibles
 * y la categoría actualmente seleccionada por el usuario para filtrar el menú.
 */
export const useCategoryStore = defineStore("category", () => {
	const categories: Ref<CategoryType[]> = ref<CategoryType[]>([]);
	const preferredCategory: Ref<CategoryType> = ref<CategoryType>(null);
	const error: Ref<string> = ref<string>(null);

	/**
	 * Carga todas las categorías desde `CategoryService.getAllCategories` y las
	 * asigna a `categories`. Si la respuesta indica fallo (`success: false`),
	 * deja `categories` sin modificar y guarda el mensaje en `error`.
	 */
	async function loadCategories() {
		const response: ResponseType<CategoryType[]> = await getAllCategories();

		if (!response.success) {
			error.value = response.message;
			return;
		}

		categories.value = response.data;
	}

	/**
	 * Selecciona, dentro de `categories` ya cargadas, la categoría con el `id`
	 * dado y la asigna a `preferredCategory`. Si no existe ninguna coincidencia,
	 * `preferredCategory` queda en `undefined`.
	 *
	 * @param id - Identificador de la categoría a seleccionar.
	 */
	async function setPreferredCategory(id: string) {
		preferredCategory.value = categories.value.find((category) => category.id === id);
	}

	return { categories, preferredCategory, error, loadCategories, setPreferredCategory };
});

// Enable hot module
if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot));
}
