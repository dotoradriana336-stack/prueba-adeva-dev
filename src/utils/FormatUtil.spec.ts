import { describe, it, expect } from "vitest";
import { formatCurrency, formatPercentage, formatReview, formatReviewPercentage } from "./FormatUtil";

describe("FormatUtil", () => {
	describe("formatCurrency", () => {
		it("formatea un valor positivo con 2 decimales por defecto", () => {
			expect(formatCurrency(12.5)).toBe("$12.50");
		});

		it("respeta la cantidad de decimales indicada", () => {
			expect(formatCurrency(12.5, 0)).toBe("$13");
		});

		it("formatea 0 como $0.00", () => {
			expect(formatCurrency(0)).toBe("$0.00");
		});

		it("formatea valores negativos con signo", () => {
			expect(formatCurrency(-5)).toBe("-$5.00");
		});
	});

	describe("formatPercentage", () => {
		it("formatea un valor con 2 decimales y el símbolo %", () => {
			expect(formatPercentage(12.5)).toBe("12.50%");
		});

		it("formatea 0 como 0.00%", () => {
			expect(formatPercentage(0)).toBe("0.00%");
		});

		it("no divide el valor recibido: 100 se muestra como 100.00%", () => {
			expect(formatPercentage(100)).toBe("100.00%");
		});
	});

	describe("formatReview", () => {
		it("calcula el promedio y lo formatea con 1 decimal", () => {
			expect(formatReview(45, 10)).toBe("4.5");
		});

		it("redondea el promedio a 1 decimal", () => {
			expect(formatReview(10, 3)).toBe("3.3");
		});

		it("formatea como el símbolo de infinito cuando reviews es 0 (división por cero)", () => {
			expect(formatReview(5, 0)).toBe("∞");
		});
	});

	describe("formatReviewPercentage", () => {
		it("calcula el porcentaje de una calificación sobre el total de reseñas", () => {
			expect(formatReviewPercentage(5, 10)).toBe(50);
		});

		it("retorna 0 cuando rating es 0", () => {
			expect(formatReviewPercentage(0, 10)).toBe(0);
		});

		it("retorna Infinity cuando reviews es 0 (división por cero)", () => {
			expect(formatReviewPercentage(5, 0)).toBe(Infinity);
		});
	});
});
