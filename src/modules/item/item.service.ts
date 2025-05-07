import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITEM_ERRORS } from "src/constants/errors";
import { Item } from "src/entities/item.entity";

import { updateItemDto } from "./dto/update-item.dto";

@Injectable()
export class ItemService {
	constructor(
		@InjectRepository(Item)
		private itemRepository: Repository<Item>,
	) {}

	async getAll() {
		return await this.itemRepository.find({
			order: {
				id: "ASC",
			},
		});
	}
	async updateItem(id: number, updateItemDto: updateItemDto) {
		const item = await this.itemRepository.findOneBy({ id });
		if (!item) {
			throw new NotFoundException(ITEM_ERRORS.NOT_FOUND);
		}
		Object.assign(item, updateItemDto);
		return await this.itemRepository.save(item);
	}
}
