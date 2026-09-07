import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";

vi.mock("@/router", () => ({
	default: { push: vi.fn() }
}));

import httpClient from "./index";
import router from "@/router";

// Se reemplaza el mock adapter instalado por useMock() en tiempo de import por uno
// propio, controlado por cada test, para poder ejercitar los interceptores de forma
// aislada (sin depender de los endpoints reales de src/mocks).
describe("http client (src/http/index.ts)", () => {
	let mock: MockAdapter;

	beforeEach(() => {
		mock = new MockAdapter(httpClient);
	});

	afterEach(() => {
		mock.restore();
		vi.clearAllMocks();
	});

	it("retorna response.data directamente ante una respuesta 2xx", async () => {
		const payload = { success: true, data: [{ id: "1" }] };
		mock.onGet("/test-ok").reply(200, payload);

		const result = await httpClient.get("/test-ok");

		expect(result).toEqual(payload);
	});

	it("ante una respuesta fuera de 2xx, rechaza la promesa con el payload de error", async () => {
		const errorPayload = { success: false, message: "Internal Server Error" };
		mock.onGet("/test-error").reply(500, errorPayload);

		await expect(httpClient.get("/test-error")).rejects.toEqual(errorPayload);
	});

	it("ante una respuesta fuera de 2xx, redirige a /error/:status usando el status recibido", async () => {
		mock.onGet("/test-404").reply(404, { success: false, message: "Not Found" });

		await expect(httpClient.get("/test-404")).rejects.toBeDefined();

		expect(router.push).toHaveBeenCalledWith("/error/404");
		expect(router.push).toHaveBeenCalledTimes(1);
	});

	it("no redirige cuando la respuesta es exitosa", async () => {
		mock.onGet("/test-ok").reply(200, { success: true, data: null });

		await httpClient.get("/test-ok");

		expect(router.push).not.toHaveBeenCalled();
	});
});
