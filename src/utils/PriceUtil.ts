import type { ProductType } from "@/types/ProductType";

/**
 * Suma el costo de todos los adicionales seleccionados de un producto
 * (`precio unitario × cantidad` de cada adicional).
 *
 * @param product - Producto cuyos adicionales se van a sumar.
 * @returns El costo total de los adicionales (0 si no hay ninguno).
 */
const getAdditionalsCost = (product: ProductType): number => {
	return product.additionals.reduce(
		(accumulator, currentValue) => accumulator + currentValue.price * currentValue.quantity,
		0
	);
};

/**
 * Calcula el costo actual de un producto: su `price` más el costo de sus adicionales.
 *
 * @param product - Producto a calcular.
 * @returns El costo total del producto con adicionales.
 */
export const getProductCost = (product: ProductType): number => {
	const additional = getAdditionalsCost(product);
	return product.price + additional;
};

/**
 * Calcula el costo "anterior" de un producto para mostrar el precio tachado en ofertas:
 * usa `previousPrice` si es mayor a 0, o `price` si el producto no tiene descuento vigente,
 * más el costo de sus adicionales.
 *
 * @param product - Producto a calcular.
 * @returns El costo previo (o actual, si no hay descuento) con adicionales.
 */
export const getPreviousProductCost = (product: ProductType): number => {
	const additional = getAdditionalsCost(product);
	const currentPrice = product.previousPrice > 0 ? product.previousPrice : product.price;
	return currentPrice + additional;
};

/**
 * Suma el costo actual (`getProductCost`) de una lista de productos — usado para
 * el total del carrito de checkout.
 *
 * @param products - Productos a sumar.
 * @returns El costo total (0 si la lista está vacía).
 */
export const getAllProductsCost = (products: ProductType[]): number => {
	return products
		.map((product) => {
			return getProductCost(product);
		})
		.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

/**
 * Suma el costo "anterior" (`getPreviousProductCost`) de una lista de productos —
 * usado para mostrar el subtotal tachado antes de descuentos.
 *
 * @param products - Productos a sumar.
 * @returns El costo total previo (0 si la lista está vacía).
 */
export const getAllPreviousProductsCost = (products: ProductType[]): number => {
	return products
		.map((product) => {
			return getPreviousProductCost(product);
		})
		.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

/**
 * Calcula el descuento total de una lista de productos, considerando solo los
 * que tienen `previousPrice > 0`.
 *
 * @param products - Productos a evaluar.
 * @param type - `"number"` (default) devuelve el descuento en unidades monetarias;
 *               `"percentage"` lo devuelve como porcentaje sobre `getAllProductsCost`.
 * @returns El descuento total. En modo `"percentage"`, `NaN` si `products` está vacío (división por 0).
 */
export const getAllProductsDiscount = (
	products: ProductType[],
	type: "number" | "percentage" = "number"
): number => {
	const discounts = products
		.filter((product) => product.previousPrice > 0)
		.map((product) => {
			return getProductCost(product) - getPreviousProductCost(product);
		})
		.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

	if (type === "percentage") {
		const total = getAllProductsCost(products);
		return Math.abs((discounts * 100) / total);
	}

	return discounts;
};

/**
 * Indica si una lista de productos tiene, en conjunto, algún descuento aplicado
 * (el costo previo total es mayor al costo actual total).
 *
 * @param products - Productos a evaluar.
 * @returns `true` si hay descuento neto, `false` en caso contrario.
 */
export const hasProductsDiscount = (products: ProductType[]): boolean => {
	return getAllPreviousProductsCost(products) > getAllProductsCost(products);
};
