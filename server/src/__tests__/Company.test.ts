import supertest from "supertest";
import createServer from "../utils/createServer";

const app = createServer();

// Fix the bug
describe("company", () => {
	describe("get company route", () => {
		describe("given the company does not exist", () => {
			it ("should return a 404", async () => {
				const test_ticker = "test-ticker";
				await supertest(app).get(`/companies/get/${test_ticker}`).expect(404);
			});
		});
	});
});