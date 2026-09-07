import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkoutCompletePurchase } from "./CheckoutService";
import httpClient from "@/http";
import type { ResponseType } from "@/types/ResponseType";
import type { ProductType } from "@/types/ProductType";

vi.mock("@/http", () => ({
	default: { post: vi.fn() }
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

describe("CheckoutService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("checkoutCompletePurchase", () => {
		it("solicita POST /purchase con el carrito de productos", async () => {
			const products = [makeProduct()];
			const response: ResponseType<void> = { success: true };
			vi.mocked(httpClient.post).mockResolvedValueOnce(response);

			await checkoutCompletePurchase(products);

			expect(httpClient.post).toHaveBeenCalledWith("/purchase", products);
		});

		it("envía un carrito vacío sin lanzar error", async () => {
			const response: ResponseType<void> = { success: true };
			vi.mocked(httpClient.post).mockResolvedValueOnce(response);

			await expect(checkoutCompletePurchase([])).resolves.toEqual(response);
			expect(httpClient.post).toHaveBeenCalledWith("/purchase", []);
		});

		it("propaga el rechazo cuando el cliente HTTP rechaza la promesa", async () => {
			const errorPayload = { success: false, message: "Payment declined" };
			vi.mocked(httpClient.post).mockRejectedValueOnce(errorPayload);

			await expect(checkoutCompletePurchase([makeProduct()])).rejects.toEqual(errorPayload);
		});
	});
});
