/**
 * Formatea un número como moneda USD (`en-US`), p. ej. `12.5` → `"$12.50"`.
 *
 * @param value - Monto a formatear.
 * @param digits - Cantidad de decimales a mostrar (por defecto 2).
 * @returns El monto formateado como string de moneda.
 */
export const formatCurrency = (value: number, digits: number = 2): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	}).format(value);
};

/**
 * Formatea un número como porcentaje con dos decimales, p. ej. `12.5` → `"12.50%"`.
 * No divide el valor por 100: recibe el porcentaje ya calculado.
 *
 * @param value - Valor porcentual a formatear.
 * @returns El valor formateado con el símbolo `%`.
 */
export const formatPercentage = (value: number): string => {
	return (
		new Intl.NumberFormat("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(value) + "%"
	);
};

/**
 * Calcula y formatea el promedio de calificación de un producto (`rating / reviews`)
 * con un decimal, p. ej. `rating=45, reviews=10` → `"4.5"`.
 *
 * @param rating - Suma total de calificaciones (`ProductReviewType.totalRating`).
 * @param reviews - Cantidad total de reseñas (`ProductReviewType.totalReviews`).
 * @returns El promedio formateado como string con un decimal.
 */
export const formatReview = (rating: number, reviews: number): string => {
	const average = rating / reviews;

	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	}).format(average);
};

/**
 * Calcula el porcentaje que representa `rating` sobre `reviews`, sin formatear
 * como string (uso típico: ancho de barras de distribución de reseñas).
 *
 * @param rating - Cantidad de reseñas para una calificación específica (p. ej. `rating5`).
 * @param reviews - Cantidad total de reseñas (`ProductReviewType.totalReviews`).
 * @returns El porcentaje como número (puede ser `NaN` si `reviews` es 0).
 */
export const formatReviewPercentage = (rating: number, reviews: number): number => {
	return (rating * 100) / reviews;
};
