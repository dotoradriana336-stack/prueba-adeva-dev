import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllProducts, getSuggestedProducts, getProductBySlug } from "./ProductService";
import httpClient from "@/http";

vi.mock("@/http", () => ({
	default: { get: vi.fn() }
}));

describe("ProductService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getAllProducts", () => {
		it("solicita GET /products", async () => {
			vi.mocked(httpClient.get).mockResolvedValueOnce({ success: true, data: [] });
			await getAllProducts();
			expect(httpClient.get).toHaveBeenCalledWith("/products");
		});
	});

	describe("getSuggestedProducts", () => {
		it("solicita GET /suggested/products", async () => {
			vi.mocked(httpClient.get).mockResolvedValueOnce({ success: true, data: [] });
			await getSuggestedProducts();
			expect(httpClient.get).toHaveBeenCalledWith("/suggested/products");
		});
	});

	describe("getProductBySlug", () => {
		it("solicita GET /products/:slug interpolando el slug recibido", async () => {
			vi.mocked(httpClient.get).mockResolvedValueOnce({ success: true, data: null });
			await getProductBySlug("cheeseburger");
			expect(httpClient.get).toHaveBeenCalledWith("/products/cheeseburger");
		});

		it("interpola un slug con caracteres especiales sin codificarlos", async () => {
			vi.mocked(httpClient.get).mockResolvedValueOnce({ success: true, data: null });
			await getProductBySlug("combo especial");
			expect(httpClient.get).toHaveBeenCalledWith("/products/combo especial");
		});

		it("propaga el rechazo cuando el cliente HTTP rechaza la promesa", async () => {
			const errorPayload = { success: false, message: "Not found" };
			vi.mocked(httpClient.get).mockRejectedValueOnce(errorPayload);
			await expect(getProductBySlug("inexistente")).rejects.toEqual(errorPayload);
		});
	});
});
