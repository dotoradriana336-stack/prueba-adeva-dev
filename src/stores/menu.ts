import { ref, type Ref } from "vue";
import { acceptHMRUpdate, defineStore } from "pinia";
import type { ListType } from "@/types/ListType";

const SORT_LIST: ListType[] = [
	{
		id: "relevant",
		name: "relevant",
		icon: "sort"
	},
	{
		id: "alpha",
		name: "a-z",
		icon: "alpha"
	},
	{
		id: "price",
		name: "price",
		icon: "money"
	},
	{
		id: "calories",
		name: "calories",
		icon: "calories"
	},
	{
		id: "category",
		name: "category",
		icon: "category"
	},
	{
		id: "review",
		name: "review",
		icon: "star"
	}
];

const DEFAULT_SORT: ListType = SORT_LIST[0];

/**
 * Store de Pinia de la vista Menu: opciones de orden disponibles, criterio de
 * orden seleccionado y palabra clave de búsqueda del catálogo.
 */
export const useMenuStore = defineStore("menu", () => {
	const sortList: Ref<ListType[]> = ref<ListType[]>(SORT_LIST);
	const preferredSort: Ref<ListType> = ref<ListType>(DEFAULT_SORT);
	const searchKeyword: Ref<string> = ref<string>(null);

	/**
	 * Selecciona, dentro de `sortList`, el criterio de orden con el `id` dado.
	 * Si no existe ninguna coincidencia, vuelve a `DEFAULT_SORT` ("relevant").
	 *
	 * @param id - Identificador del criterio de orden (`"relevant" | "alpha" | "price" | "calories" | "category" | "review"`).
	 */
	async function setPreferredSort(id: string) {
		preferredSort.value = SORT_LIST.find((item) => item.id === id) || DEFAULT_SORT;
	}

	/**
	 * Actualiza la palabra clave de búsqueda usada para filtrar el catálogo por nombre.
	 *
	 * @param word - Texto ingresado por el usuario en el buscador del menú.
	 */
	async function setKeyword(word: string) {
		searchKeyword.value = word;
	}

	return {
		sortList,
		preferredSort,
		searchKeyword,
		setPreferredSort,
		setKeyword
	};
});

// Enable hot module
if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot));
}
