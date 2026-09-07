import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCheckoutStore } from "./checkout";
import { checkoutCompletePurchase } from "@/services/CheckoutService";
import type { ProductType } from "@/types/ProductType";

vi.mock("@/services/CheckoutService", () => ({
	checkoutCompletePurchase: vi.fn()
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

describe("useCheckoutStore", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	it("inicia en el paso 'delivery', con carrito vacío y sin procesar", () => {
		const store = useCheckoutStore();
		expect(store.checkoutState).toBe("delivery");
		expect(store.checkoutProducts).toEqual([]);
		expect(store.checkoutQuantity).toBe(0);
		expect(store.processing).toBe(false);
		expect(store.processed).toBe(false);
	});

	describe("addProductToCart / checkoutQuantity", () => {
		it("agrega un producto y actualiza checkoutQuantity", async () => {
			const store = useCheckoutStore();
			await store.addProductToCart(makeProduct());

			expect(store.checkoutProducts).toHaveLength(1);
			expect(store.checkoutQuantity).toBe(1);
		});

		it("permite agregar el mismo producto más de una vez (no deduplica)", async () => {
			const store = useCheckoutStore();
			const product = makeProduct();
			await store.addProductToCart(product);
			await store.addProductToCart(product);

			expect(store.checkoutQuantity).toBe(2);
		});
	});

	describe("removeProductFromCart", () => {
		it("elimina del carrito el producto con el id indicado", async () => {
			const store = useCheckoutStore();
			await store.addProductToCart(makeProduct({ id: "a" }));
			await store.addProductToCart(makeProduct({ id: "b" }));

			await store.removeProductFromCart("a");

			expect(store.checkoutProducts.map((p) => p.id)).toEqual(["b"]);
		});

		it("no lanza error al eliminar un id que no está en el carrito", async () => {
			const store = useCheckoutStore();
			await store.addProductToCart(makeProduct({ id: "a" }));

			await expect(store.removeProductFromCart("inexistente")).resolves.not.toThrow();
			expect(store.checkoutQuantity).toBe(1);
		});
	});

	describe("completePurchase", () => {
		it("marca processed en true cuando la compra se completa con éxito", async () => {
			vi.mocked(checkoutCompletePurchase).mockResolvedValueOnce({ success: true });

			const store = useCheckoutStore();
			await store.completePurchase();

			expect(store.processed).toBe(true);
			expect(store.processing).toBe(false);
			expect(store.error).toBeNull();
		});

		it("guarda el mensaje de error y deja processed en false cuando la compra falla", async () => {
			vi.mocked(checkoutCompletePurchase).mockResolvedValueOnce({
				success: false,
				message: "Payment declined"
			});

			const store = useCheckoutStore();
			await store.completePurchase();

			expect(store.processed).toBe(false);
			expect(store.processing).toBe(false);
			expect(store.error).toBe("Payment declined");
		});
	});

	describe("finalizeCheckout", () => {
		it("vacía el carrito, vuelve a 'delivery' y limpia processed", async () => {
			vi.mocked(checkoutCompletePurchase).mockResolvedValueOnce({ success: true });

			const store = useCheckoutStore();
			await store.addProductToCart(makeProduct());
			await store.changeCheckoutState("payment");
			await store.completePurchase();

			await store.finalizeCheckout();

			expect(store.checkoutProducts).toEqual([]);
			expect(store.checkoutState).toBe("delivery");
			expect(store.processed).toBe(false);
		});
	});

	describe("changeCheckoutState", () => {
		it("cambia el estado del wizard a 'payment'", async () => {
			const store = useCheckoutStore();
			await store.changeCheckoutState("payment");
			expect(store.checkoutState).toBe("payment");
		});
	});

	describe("setCheckoutDelivery / setCheckoutPayment", () => {
		it("reemplaza los datos de entrega", async () => {
			const store = useCheckoutStore();
			const delivery = { address: "123 Main St", city: "Springfield", state: "IL", zipcode: "62704" };
			await store.setCheckoutDelivery(delivery);
			expect(store.checkoutDelivery).toEqual(delivery);
		});

		it("reemplaza los datos de pago", async () => {
			const store = useCheckoutStore();
			const payment = { holderName: "John Doe", cardNumber: 4111111111111111, expiryDate: "12/28", cvv: 123 };
			await store.setCheckoutPayment(payment);
			expect(store.checkoutPayment).toEqual(payment);
		});
	});
});
