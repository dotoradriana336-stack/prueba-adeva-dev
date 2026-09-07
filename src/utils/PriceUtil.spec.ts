import { describe, it, expect } from "vitest";
import {
	getProductCost,
	getPreviousProductCost,
	getAllProductsCost,
	getAllPreviousProductsCost,
	getAllProductsDiscount,
	hasProductsDiscount
} from "./PriceUtil";
import type { ProductAdditionalType, ProductType } from "@/types/ProductType";

function makeAdditional(overrides: Partial<ProductAdditionalType> = {}): ProductAdditionalType {
	return {
		id: "add-1",
		name: "Extra cheese",
		description: "Extra slice of cheese",
		price: 1,
		quantity: 1,
		limit: 5,
		...overrides
	};
}

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
		ingredients: ["bread", "cheese", "beef"],
		maxAdditionals: 3,
		additionals: [],
		reviews: {
			totalRating: 40,
			totalReviews: 10,
			rating1: 0,
			rating2: 0,
			rating3: 2,
			rating4: 3,
			rating5: 5
		},
		...overrides
	};
}

describe("PriceUtil", () => {
	describe("getProductCost", () => {
		it("retorna el price cuando el producto no tiene adicionales", () => {
			const product = makeProduct({ price: 10, additionals: [] });
			expect(getProductCost(product)).toBe(10);
		});

		it("suma el costo de los adicionales (precio × cantidad)", () => {
			const product = makeProduct({
				price: 10,
				additionals: [makeAdditional({ price: 2, quantity: 3 })]
			});
			expect(getProductCost(product)).toBe(16);
		});

		it("suma múltiples adicionales", () => {
			const product = makeProduct({
				price: 10,
				additionals: [
					makeAdditional({ price: 2, quantity: 1 }),
					makeAdditional({ price: 1, quantity: 2 })
				]
			});
			expect(getProductCost(product)).toBe(14);
		});
	});

	describe("getPreviousProductCost", () => {
		it("usa previousPrice cuando es mayor a 0", () => {
			const product = makeProduct({ price: 10, previousPrice: 15, additionals: [] });
			expect(getPreviousProductCost(product)).toBe(15);
		});

		it("usa price cuando previousPrice es 0 (sin descuento)", () => {
			const product = makeProduct({ price: 10, previousPrice: 0, additionals: [] });
			expect(getPreviousProductCost(product)).toBe(10);
		});

		it("usa price cuando previousPrice es negativo", () => {
			const product = makeProduct({ price: 10, previousPrice: -5, additionals: [] });
			expect(getPreviousProductCost(product)).toBe(10);
		});

		it("incluye el costo de adicionales sobre previousPrice", () => {
			const product = makeProduct({
				price: 10,
				previousPrice: 15,
				additionals: [makeAdditional({ price: 1, quantity: 1 })]
			});
			expect(getPreviousProductCost(product)).toBe(16);
		});
	});

	describe("getAllProductsCost", () => {
		it("suma el costo de una lista de productos", () => {
			const products = [makeProduct({ price: 10 }), makeProduct({ price: 5 })];
			expect(getAllProductsCost(products)).toBe(15);
		});

		it("retorna 0 para una lista vacía", () => {
			expect(getAllProductsCost([])).toBe(0);
		});
	});

	describe("getAllPreviousProductsCost", () => {
		it("suma el costo previo de una lista de productos", () => {
			const products = [
				makeProduct({ price: 10, previousPrice: 12 }),
				makeProduct({ price: 5, previousPrice: 0 })
			];
			expect(getAllPreviousProductsCost(products)).toBe(17);
		});

		it("retorna 0 para una lista vacía", () => {
			expect(getAllPreviousProductsCost([])).toBe(0);
		});
	});

	describe("getAllProductsDiscount", () => {
		it("calcula el descuento en unidades monetarias por defecto (negativo: costo actual menos costo previo)", () => {
			const products = [makeProduct({ price: 8, previousPrice: 10 })];
			expect(getAllProductsDiscount(products)).toBe(-2);
		});

		it("ignora productos sin previousPrice (previousPrice <= 0)", () => {
			const products = [makeProduct({ price: 8, previousPrice: 0 })];
			expect(getAllProductsDiscount(products)).toBe(0);
		});

		it("calcula el descuento como porcentaje cuando type es 'percentage'", () => {
			const products = [makeProduct({ price: 8, previousPrice: 10 })];
			expect(getAllProductsDiscount(products, "percentage")).toBe(25);
		});

		it("retorna 0 para una lista vacía en modo 'number'", () => {
			expect(getAllProductsDiscount([])).toBe(0);
		});

		it("retorna NaN para una lista vacía en modo 'percentage' (división por 0)", () => {
			expect(getAllProductsDiscount([], "percentage")).toBeNaN();
		});
	});

	describe("hasProductsDiscount", () => {
		it("retorna true cuando el costo previo total es mayor al actual", () => {
			const products = [makeProduct({ price: 8, previousPrice: 10 })];
			expect(hasProductsDiscount(products)).toBe(true);
		});

		it("retorna false cuando no hay diferencia entre costo previo y actual", () => {
			const products = [makeProduct({ price: 10, previousPrice: 0 })];
			expect(hasProductsDiscount(products)).toBe(false);
		});

		it("retorna false para una lista vacía", () => {
			expect(hasProductsDiscount([])).toBe(false);
		});
	});
});
