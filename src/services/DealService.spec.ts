import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	getProductsDeals,
	getSpecialProducts,
	getProductsExperience,
	getDailyProduct,
	getHighlightedProduct
} from "./DealService";
import httpClient from "@/http";

vi.mock("@/http", () => ({
	default: { get: vi.fn() }
}));

describe("DealService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("getProductsDeals solicita GET /deals", async () => {
		vi.mocked(httpClient.get).mockResolvedValueOnce({ success: true, data: [] });
		await getProductsDeals();
		expect(httpClient.get).toHaveBeenCalledWith("/deals");
	});

	it("getSpecialProducts solicita GET /deals/special", async () => {
		vi.mocked(httpClient.get).mockResolvedValueOnce({ success: true, data: [] });
		await getSpecialProducts();
		expect(httpClient.get).toHaveBeenCalledWith("/deals/special");
	});

	it("getProductsExperience solicita GET /deals/experience", async () => {
		vi.mocked(httpClient.get).mockResolvedValueOnce({ success: true, data: [] });
		await getProductsExperience();
		expect(httpClient.get).toHaveBeenCalledWith("/deals/experience");
	});

	it("getDailyProduct solicita GET /deals/daily", async () => {
		vi.mocked(httpClient.get).mockResolvedValueOnce({ success: true, data: null });
		await getDailyProduct();
		expect(httpClient.get).toHaveBeenCalledWith("/deals/daily");
	});

	it("getHighlightedProduct solicita GET /deals/highlighted", async () => {
		vi.mocked(httpClient.get).mockResolvedValueOnce({ success: true, data: null });
		await getHighlightedProduct();
		expect(httpClient.get).toHaveBeenCalledWith("/deals/highlighted");
	});

	it("propaga el rechazo cuando el cliente HTTP rechaza la promesa", async () => {
		const errorPayload = { success: false, message: "Network Error" };
		vi.mocked(httpClient.get).mockRejectedValueOnce(errorPayload);
		await expect(getProductsDeals()).rejects.toEqual(errorPayload);
	});
});
