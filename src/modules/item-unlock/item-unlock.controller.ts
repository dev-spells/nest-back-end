import { Controller } from "@nestjs/common";

import { ItemUnlockService } from "./item-unlock.service";

@Controller("item-unlock")
export class ItemUnlockController {
	constructor(private readonly itemUnlockService: ItemUnlockService) {}
}
