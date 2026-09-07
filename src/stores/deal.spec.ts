import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useDealStore } from "./deal";
import {
	getSpecialProducts,
	getProductsDeals,
	getProductsExperience
} from "@/services/DealService";
import type { ProductType } from "@/types/ProductType";

vi.mock("@/services/DealService", () => ({
	getSpecialProducts: vi.fn(),
	getProductsDeals: vi.fn(),
	getProductsExperience: vi.fn()
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

describe("useDealStore", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("inicia con las tres listas vacías y sin error", () => {
		const store = useDealStore();
		expect(store.specialProducts).toEqual([]);
		expect(store.productsDeals).toEqual([]);
		expect(store.productsExperience).toEqual([]);
	});

	describe("loadSpecialProducts", () => {
		it("asigna specialProducts cuando la respuesta es exitosa", async () => {
			const products = [makeProduct({ special: true })];
			vi.mocked(getSpecialProducts).mockResolvedValueOnce({ success: true, data: products });

			const store = useDealStore();
			await store.loadSpecialProducts();

			expect(store.specialProducts).toEqual(products);
		});

		it("no modifica specialProducts y guarda el error cuando la respuesta falla", async () => {
			vi.mocked(getSpecialProducts).mockResolvedValueOnce({ success: false, message: "error" });

			const store = useDealStore();
			await store.loadSpecialProducts();

			expect(store.specialProducts).toEqual([]);
			expect(store.error).toBe("error");
		});
	});

	describe("loadProductsDeals", () => {
		it("asigna productsDeals cuando la respuesta es exitosa", async () => {
			const products = [makeProduct()];
			vi.mocked(getProductsDeals).mockResolvedValueOnce({ success: true, data: products });

			const store = useDealStore();
			await store.loadProductsDeals();

			expect(store.productsDeals).toEqual(products);
		});

		it("no modifica productsDeals y guarda el error cuando la respuesta falla", async () => {
			vi.mocked(getProductsDeals).mockResolvedValueOnce({ success: false, message: "error" });

			const store = useDealStore();
			await store.loadProductsDeals();

			expect(store.productsDeals).toEqual([]);
			expect(store.error).toBe("error");
		});
	});

	describe("loadProductsExperience", () => {
		it("asigna productsExperience cuando la respuesta es exitosa", async () => {
			const products = [makeProduct()];
			vi.mocked(getProductsExperience).mockResolvedValueOnce({ success: true, data: products });

			const store = useDealStore();
			await store.loadProductsExperience();

			expect(store.productsExperience).toEqual(products);
		});

		it("no modifica productsExperience y guarda el error cuando la respuesta falla", async () => {
			vi.mocked(getProductsExperience).mockResolvedValueOnce({ success: false, message: "error" });

			const store = useDealStore();
			await store.loadProductsExperience();

			expect(store.productsExperience).toEqual([]);
			expect(store.error).toBe("error");
		});
	});
});
