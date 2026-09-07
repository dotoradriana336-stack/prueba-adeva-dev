import { computed, ref, type ComputedRef, type Ref } from "vue";
import { acceptHMRUpdate, defineStore } from "pinia";
import { checkoutCompletePurchase } from "@/services/CheckoutService";
import type { ProductType } from "@/types/ProductType";
import type { ResponseType } from "@/types/ResponseType";
import type {
	CheckoutStateType,
	CheckoutDeliveryType,
	CheckoutPaymentType
} from "@/types/CheckoutType";

const DEFAULT_DELIVERY: CheckoutDeliveryType = {
	address: null,
	city: null,
	state: null,
	zipcode: null
};

const DEFAULT_PAYMENT: CheckoutPaymentType = {
	holderName: null,
	cardNumber: null,
	expiryDate: null,
	cvv: null
};

/**
 * Store de Pinia del flujo de checkout: carrito de productos, datos de entrega
 * y pago, estado del wizard (`"delivery" | "payment"`) y ejecución de la compra
 * simulada contra `CheckoutService`.
 */
export const useCheckoutStore = defineStore("checkout", () => {
	const checkoutState: Ref<CheckoutStateType> = ref<CheckoutStateType>("delivery");
	const checkoutProducts: Ref<ProductType[]> = ref<ProductType[]>([]);
	const checkoutDelivery: Ref<CheckoutDeliveryType> = ref<CheckoutDeliveryType>(DEFAULT_DELIVERY);
	const checkoutPayment: Ref<CheckoutPaymentType> = ref<CheckoutPaymentType>(DEFAULT_PAYMENT);
	const processing: Ref<boolean> = ref<boolean>(false);
	const processed: Ref<boolean> = ref<boolean>(false);
	const error: Ref<string> = ref<string>(null);

	/** Cantidad de ítems actualmente en el carrito de checkout. */
	const checkoutQuantity: ComputedRef<number> = computed<number>(
		() => checkoutProducts.value.length
	);

	/**
	 * Agrega un producto al carrito de checkout. No deduplica por `id`: agregar
	 * el mismo producto dos veces produce dos entradas independientes en `checkoutProducts`.
	 *
	 * @param product - Producto a agregar al carrito.
	 */
	async function addProductToCart(product: ProductType) {
		checkoutProducts.value = [...checkoutProducts.value, product];
	}

	/**
	 * Elimina del carrito todas las entradas cuyo `id` coincida con el indicado.
	 *
	 * @param id - Identificador del producto a eliminar.
	 */
	async function removeProductFromCart(id: string) {
		checkoutProducts.value = checkoutProducts.value.filter((product) => product.id !== id);
	}

	/**
	 * Envía el carrito actual a `CheckoutService.checkoutCompletePurchase` para
	 * simular el pago. Marca `processing` mientras la petición está en curso;
	 * si la respuesta indica fallo, guarda el mensaje en `error` y dejar `processed`
	 * en `false`. Si la respuesta indica éxito, marca `processed` en `true`.
	 */
	async function completePurchase() {
		processing.value = true;
		const response: ResponseType<void> = await checkoutCompletePurchase(checkoutProducts.value);

		if (!response.success) {
			error.value = response.message;
			processing.value = false;
			return;
		}

		processing.value = false;
		processed.value = true;
	}

	/**
	 * Reinicia el checkout tras una compra completada: vacía el carrito, vuelve
	 * el wizard al paso `"delivery"` y limpia el flag `processed`.
	 */
	async function finalizeCheckout() {
		checkoutProducts.value = [];
		checkoutState.value = "delivery";
		processed.value = false;
	}

	/**
	 * Reemplaza los datos de entrega capturados en el formulario de checkout.
	 *
	 * @param delivery - Datos de dirección de entrega.
	 */
	async function setCheckoutDelivery(delivery: CheckoutDeliveryType) {
		checkoutDelivery.value = delivery;
	}

	/**
	 * Reemplaza los datos de pago capturados en el formulario de checkout.
	 *
	 * @param payment - Datos de la tarjeta/pago.
	 */
	async function setCheckoutPayment(payment: CheckoutPaymentType) {
		checkoutPayment.value = payment;
	}

	/**
	 * Cambia el paso actual del wizard de checkout.
	 *
	 * @param state - Nuevo estado (`"delivery"` o `"payment"`).
	 */
	async function changeCheckoutState(state: CheckoutStateType) {
		checkoutState.value = state;
	}

	return {
		processing,
		processed,
		error,
		checkoutState,
		checkoutDelivery,
		checkoutPayment,
		checkoutProducts,
		checkoutQuantity,
		changeCheckoutState,
		setCheckoutDelivery,
		setCheckoutPayment,
		addProductToCart,
		removeProductFromCart,
		completePurchase,
		finalizeCheckout
	};
});

// Enable hot module
if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useCheckoutStore, import.meta.hot));
}
