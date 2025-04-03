import { Test, TestingModule } from "@nestjs/testing";

import { SpellBookService } from "./spell-book.service";

describe("SpellBookService", () => {
	let service: SpellBookService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SpellBookService],
		}).compile();

		service = module.get<SpellBookService>(SpellBookService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
