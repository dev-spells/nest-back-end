import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ITEM_ERRORS, SHOP_ERRORS } from "src/constants/errors";
import {
	ITEM_PROTECT_DAILY_STREAK_ID,
	ITEM_UNLOCK_CHATBOT_ID,
	ITEM_UNLOCK_SOLUTION_ID,
	ITEM_XP_ID,
} from "src/constants/item";
import { Shop } from "src/entities/shop.entity";
import { User } from "src/entities/user.entity";
import { UserItem } from "src/entities/user-item.entity";

import { AddItemInShopDto } from "./dto/create-shop.dto";
import { UpdateShopDto } from "./dto/update-shop.dto";

@Injectable()
export class ShopService {
	constructor(
		@InjectRepository(Shop)
		private shopRepository: Repository<Shop>,
		@InjectRepository(UserItem)
		private userItemRepository: Repository<UserItem>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async getAll(userId: string, isAdmin: boolean) {
		if (isAdmin) {
			return await this.shopRepository.find({
				select: {
					itemId: true,
					sellPrices: true,
					buyPrices: true,
					item: {
						name: true,
						imageUrl: true,
						description: true,
					},
				},
				relations: {
					item: true,
				},
				order: {
					itemId: "ASC",
				},
			});
		}

		const itemInShop = await this.shopRepository.find({
			select: {
				itemId: true,
				sellPrices: true,
				buyPrices: true,
				item: {
					name: true,
					imageUrl: true,
					description: true,
				},
			},
			relations: {
				item: true,
			},
		});
		const userItems = await this.userItemRepository.find({
			select: {
				itemId: true,
				quantity: true,
				item: {
					name: true,
					imageUrl: true,
					description: true,
				},
			},
			where: {
				userId: userId,
			},
			relations: {
				item: true,
			},
		});
		let mergedItems;
		if (userItems.length > itemInShop.length) {
			mergedItems = userItems.map(item => {
				const userItem = itemInShop.find(
					userItem => userItem.itemId === item.itemId,
				);
				return {
					...item,
					...userItem,
					quantity: item ? item.quantity : 0,
					buyPrices: userItem?.buyPrices ? userItem.buyPrices : null,
					sellPrices: userItem?.sellPrices ? userItem.sellPrices : null,
				};
			});
		} else {
			mergedItems = itemInShop.map(item => {
				const userItem = userItems.find(
					userItem => userItem.itemId === item.itemId,
				);
				return {
					...item,
					quantity: userItem ? userItem.quantity : 0,
				};
			});
		}

		return mergedItems.sort((a, b) => a.itemId - b.itemId);
	}
	async updatePrice(itemId: number, updateShopDto: UpdateShopDto) {
		const itemInShop = await this.shopRepository.findOne({ where: { itemId } });
		if (!itemInShop) {
			throw new NotFoundException(SHOP_ERRORS.NOT_FOUND);
		}
		return await this.shopRepository.save({
			...itemInShop,
			...updateShopDto,
		});
	}

	async addItem(itemId: number, addItemInShopDto: AddItemInShopDto) {
		if (
			![
				ITEM_PROTECT_DAILY_STREAK_ID,
				ITEM_UNLOCK_CHATBOT_ID,
				ITEM_XP_ID,
				ITEM_UNLOCK_SOLUTION_ID,
			].includes(itemId)
		) {
			throw new NotFoundException(ITEM_ERRORS.NOT_FOUND);
		}
		const isItemInShop = await this.shopRepository.exists({
			where: { itemId: itemId },
		});
		if (isItemInShop) {
			throw new BadRequestException(SHOP_ERRORS.ALREADY_EXISTS);
		}
		return await this.shopRepository.save({
			itemId: itemId,
			...addItemInShopDto,
		});
	}
	async removeItem(itemId: number) {
		const itemInShop = await this.shopRepository.findOne({ where: { itemId } });
		if (!itemInShop) {
			throw new NotFoundException(SHOP_ERRORS.NOT_FOUND);
		}

		return await this.shopRepository.delete({ itemId });
	}
	async sell(userId: string, itemId: number) {
		const userItem = await this.userItemRepository.findOne({
			where: { userId: userId, itemId: itemId },
			relations: {
				user: true,
			},
		});
		if (!userItem) {
			throw new NotFoundException(ITEM_ERRORS.NOT_FOUND);
		}
		if (userItem.quantity <= 0) {
			throw new BadRequestException(SHOP_ERRORS.NOT_ENOUGH_ITEM);
		}
		const itemInShop = await this.shopRepository.findOne({
			where: { itemId: itemId },
			select: { sellPrices: true },
		});

		if (!itemInShop) {
			throw new NotFoundException(SHOP_ERRORS.NOT_FOUND);
		}

		const updatedUserItem = await this.userItemRepository.save({
			userId,
			itemId,
			quantity: userItem.quantity - 1,
		});
		const updatedUser = await this.userRepository.save({
			id: userId,
			gems: userItem.user.gems + itemInShop.sellPrices,
		});
		return {
			itemId: itemId,
			quantity: updatedUserItem.quantity,
			gems: updatedUser.gems,
		};
	}
	async buy(userId: string, itemId: number) {
		let userItem = await this.userItemRepository.findOne({
			where: { userId: userId, itemId: itemId },
			relations: {
				user: true,
			},
		});
		if (!userItem) {
			userItem = await this.userItemRepository.save({
				userId: userId,
				itemId: itemId,
				quantity: 0,
			});
		}
		const itemInShop = await this.shopRepository.findOne({
			where: { itemId: itemId },
			select: { buyPrices: true },
		});
		if (!itemInShop) {
			throw new NotFoundException(SHOP_ERRORS.NOT_FOUND);
		}
		if (userItem.user.gems < itemInShop.buyPrices) {
			throw new BadRequestException(SHOP_ERRORS.NOT_ENOUGH_MONEY);
		}

		const updatedUserItem = await this.userItemRepository.save({
			userId,
			itemId,
			quantity: userItem.quantity + 1,
		});
		const updatedUser = await this.userRepository.save({
			id: userId,
			gems: userItem.user.gems - itemInShop.buyPrices,
		});
		return {
			itemId: itemId,
			quantity: updatedUserItem.quantity,
			gems: updatedUser.gems,
		};
	}
}
