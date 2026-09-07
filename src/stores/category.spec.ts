import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCategoryStore } from "./category";
import { getAllCategories } from "@/services/CategoryService";
import type { CategoryType } from "@/types/CategoryType";

vi.mock("@/services/CategoryService", () => ({
	getAllCategories: vi.fn()
}));

describe("useCategoryStore", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("inicia con categories vacío, sin categoría preferida y sin error", () => {
		const store = useCategoryStore();
		expect(store.categories).toEqual([]);
		expect(store.preferredCategory).toBeNull();
		expect(store.error).toBeNull();
	});

	describe("loadCategories", () => {
		it("asigna las categorías cuando la respuesta es exitosa", async () => {
			const categories: CategoryType[] = [{ id: "burgers", name: "Burgers", image: "burgers.png" }];
			vi.mocked(getAllCategories).mockResolvedValueOnce({ success: true, data: categories });

			const store = useCategoryStore();
			await store.loadCategories();

			expect(store.categories).toEqual(categories);
			expect(store.error).toBeNull();
		});

		it("guarda el mensaje de error y no modifica categories cuando la respuesta falla", async () => {
			vi.mocked(getAllCategories).mockResolvedValueOnce({
				success: false,
				message: "No se pudieron cargar las categorías"
			});

			const store = useCategoryStore();
			await store.loadCategories();

			expect(store.categories).toEqual([]);
			expect(store.error).toBe("No se pudieron cargar las categorías");
		});
	});

	describe("setPreferredCategory", () => {
		it("selecciona la categoría con el id indicado", async () => {
			const categories: CategoryType[] = [
				{ id: "burgers", name: "Burgers", image: "burgers.png" },
				{ id: "drinks", name: "Drinks", image: "drinks.png" }
			];
			vi.mocked(getAllCategories).mockResolvedValueOnce({ success: true, data: categories });

			const store = useCategoryStore();
			await store.loadCategories();
			await store.setPreferredCategory("drinks");

			expect(store.preferredCategory).toEqual(categories[1]);
		});

		it("deja preferredCategory en undefined cuando el id no existe en categories", async () => {
			const store = useCategoryStore();
			await store.setPreferredCategory("inexistente");

			expect(store.preferredCategory).toBeUndefined();
		});
	});
});
