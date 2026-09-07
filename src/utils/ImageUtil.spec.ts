import { describe, it, expect } from "vitest";
import { loadDynamicAsset, loadDynamicImage, loadDynamicSvg } from "./ImageUtil";

// Nota: `new URL(\`...${var}...\`, import.meta.url)` es un patrón que Vite resuelve
// en tiempo de build contra los assets reales de src/assets — por eso estos tests
// usan nombres de archivo que existen de verdad en el proyecto en lugar de valores
// arbitrarios: con un asset inexistente, el bundler no puede resolver la URL.
describe("ImageUtil", () => {
	describe("loadDynamicAsset", () => {
		it("resuelve la URL de un asset existente bajo src/", () => {
			const url = loadDynamicAsset("assets/dishes/dish1.png");
			expect(url).toContain("dish1.png");
		});
	});

	describe("loadDynamicImage", () => {
		it("resuelve la URL de una imagen PNG existente combinando path e image", () => {
			const url = loadDynamicImage("dishes", "dish1");
			expect(url).toContain("dish1.png");
		});
	});

	describe("loadDynamicSvg", () => {
		it("resuelve la URL de un SVG existente combinando path y svg", () => {
			const url = loadDynamicSvg("avatars", "Avatar1");
			expect(url).toContain("Avatar1.svg");
		});
	});
});
