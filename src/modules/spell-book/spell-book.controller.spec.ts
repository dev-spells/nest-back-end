import { Test, TestingModule } from "@nestjs/testing";

import { SpellBookController } from "./spell-book.controller";
import { SpellBookService } from "./spell-book.service";

describe("SpellBookController", () => {
	let controller: SpellBookController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SpellBookController],
			providers: [SpellBookService],
		}).compile();

		controller = module.get<SpellBookController>(SpellBookController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
