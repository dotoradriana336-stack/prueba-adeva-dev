import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAllCategories } from "./CategoryService";
import httpClient from "@/http";
import type { ResponseType } from "@/types/ResponseType";
import type { CategoryType } from "@/types/CategoryType";

vi.mock("@/http", () => ({
	default: { get: vi.fn() }
}));

describe("CategoryService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getAllCategories", () => {
		it("solicita GET /categories", async () => {
			const response: ResponseType<CategoryType[]> = { success: true, data: [] };
			vi.mocked(httpClient.get).mockResolvedValueOnce(response);

			await getAllCategories();

			expect(httpClient.get).toHaveBeenCalledWith("/categories");
			expect(httpClient.get).toHaveBeenCalledTimes(1);
		});

		it("retorna la lista de categorías cuando la respuesta es exitosa", async () => {
			const categories: CategoryType[] = [{ id: "burgers", name: "Burgers", image: "burgers.png" }];
			const response: ResponseType<CategoryType[]> = { success: true, data: categories };
			vi.mocked(httpClient.get).mockResolvedValueOnce(response);

			const result = await getAllCategories();

			expect(result).toEqual(response);
		});

		it("propaga el rechazo cuando el cliente HTTP rechaza la promesa", async () => {
			const errorPayload = { success: false, message: "Network Error" };
			vi.mocked(httpClient.get).mockRejectedValueOnce(errorPayload);

			await expect(getAllCategories()).rejects.toEqual(errorPayload);
		});
	});
});
