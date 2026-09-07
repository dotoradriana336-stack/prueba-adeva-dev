import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useProductStore } from "./product";
import { getAllProducts, getProductBySlug, getSuggestedProducts } from "@/services/ProductService";
import type { ProductType } from "@/types/ProductType";

vi.mock("@/services/ProductService", () => ({
	getAllProducts: vi.fn(),
	getProductBySlug: vi.fn(),
	getSuggestedProducts: vi.fn()
}));

function makeProduct(overrides: Partial<ProductType> = {}): ProductType {
	return {
		id: "prod-1",
		slug: "cheeseburger",
		quantity: 1,
		order: 1,
		category: "burgers",
		name: "Cheeseburger",
		description: "Classic cheeseburger",
		image: "cheeseburger.png",
		price: 10,
		previousPrice: 0,
		suggested: false,
		special: false,
		calories: 500,
		servingPeople: 1,
		portionSize: 1,
		unitType: "unit",
		ingredients: [],
		maxAdditionals: 0,
		additionals: [],
		reviews: {
			totalRating: 0,
			totalReviews: 0,
			rating1: 0,
			rating2: 0,
			rating3: 0,
			rating4: 0,
			rating5: 0
		},
		...overrides
	};
}

describe("useProductStore", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("inicia sin producto preferido, sin sugeridos y sin productos", () => {
		const store = useProductStore();
		expect(store.preferredProduct).toBeNull();
		expect(store.suggestedProducts).toEqual([]);
		expect(store.products).toEqual([]);
	});

	describe("loadProducts", () => {
		it("asigna products cuando la respuesta es exitosa", async () => {
			const products = [makeProduct()];
			vi.mocked(getAllProducts).mockResolvedValueOnce({ success: true, data: products });

			const store = useProductStore();
			await store.loadProducts();

			expect(store.products).toEqual(products);
		});

		it("no modifica products y guarda el error cuando la respuesta falla", async () => {
			vi.mocked(getAllProducts).mockResolvedValueOnce({ success: false, message: "error" });

			const store = useProductStore();
			await store.loadProducts();

			expect(store.products).toEqual([]);
			expect(store.error).toBe("error");
		});
	});

	describe("loadPreferredProduct", () => {
		it("asigna preferredProduct usando el slug recibido", async () => {
			const product = makeProduct({ slug: "cheeseburger" });
			vi.mocked(getProductBySlug).mockResolvedValueOnce({ success: true, data: product });

			const store = useProductStore();
			await store.loadPreferredProduct("cheeseburger");

			expect(getProductBySlug).toHaveBeenCalledWith("cheeseburger");
			expect(store.preferredProduct).toEqual(product);
		});

		it("no modifica preferredProduct y guarda el error cuando el producto no existe", async () => {
			vi.mocked(getProductBySlug).mockResolvedValueOnce({ success: false, message: "not found" });

			const store = useProductStore();
			await store.loadPreferredProduct("inexistente");

			expect(store.preferredProduct).toBeNull();
			expect(store.error).toBe("not found");
		});
	});

	describe("loadSuggestedProducts", () => {
		it("asigna suggestedProducts cuando la respuesta es exitosa", async () => {
			const products = [makeProduct({ suggested: true })];
			vi.mocked(getSuggestedProducts).mockResolvedValueOnce({ success: true, data: products });

			const store = useProductStore();
			await store.loadSuggestedProducts();

			expect(store.suggestedProducts).toEqual(products);
		});

		it("no modifica suggestedProducts y guarda el error cuando la respuesta falla", async () => {
			vi.mocked(getSuggestedProducts).mockResolvedValueOnce({ success: false, message: "error" });

			const store = useProductStore();
			await store.loadSuggestedProducts();

			expect(store.suggestedProducts).toEqual([]);
			expect(store.error).toBe("error");
		});
	});
});
