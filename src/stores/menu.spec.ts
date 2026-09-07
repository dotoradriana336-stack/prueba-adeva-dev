import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useMenuStore } from "./menu";

describe("useMenuStore", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("inicia con 6 opciones de orden y 'relevant' como preferredSort", () => {
		const store = useMenuStore();
		expect(store.sortList).toHaveLength(6);
		expect(store.preferredSort.id).toBe("relevant");
		expect(store.searchKeyword).toBeNull();
	});

	describe("setPreferredSort", () => {
		it("selecciona el criterio de orden con el id indicado", async () => {
			const store = useMenuStore();
			await store.setPreferredSort("price");
			expect(store.preferredSort.id).toBe("price");
		});

		it("vuelve al default 'relevant' cuando el id no existe en sortList", async () => {
			const store = useMenuStore();
			await store.setPreferredSort("alpha");
			await store.setPreferredSort("id-inexistente");
			expect(store.preferredSort.id).toBe("relevant");
		});
	});

	describe("setKeyword", () => {
		it("actualiza la palabra clave de búsqueda", async () => {
			const store = useMenuStore();
			await store.setKeyword("pizza");
			expect(store.searchKeyword).toBe("pizza");
		});

		it("acepta una palabra clave vacía", async () => {
			const store = useMenuStore();
			await store.setKeyword("");
			expect(store.searchKeyword).toBe("");
		});
	});
});
