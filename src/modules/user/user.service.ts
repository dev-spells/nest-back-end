import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { USER_ERRORS } from "src/constants/errors";
import { UserStreak } from "src/entities/user-streak.entity";
import { hashPassword } from "src/utils/handle-password.util";

import { User, UserRole } from "../../entities/user.entity";
import { RedisService } from "../cache/cache.service";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
// import aqp from 'api-query-params';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(UserStreak)
		private userStreakRepository: Repository<UserStreak>,
		private redisService: RedisService,
	) {}

	async createUser(dto: CreateUserDto) {
		const existingUser = await this.userRepository.findOne({
			where: { email: dto.email },
		});
		if (existingUser) {
			throw new BadRequestException(USER_ERRORS.EMAIL_IN_USE);
		}

		const hashedPassword = await hashPassword(dto.password);
		const user = this.userRepository.create({
			...dto,
			password: hashedPassword,
			level: 1,
			currentExp: 0,
			rankTitle: "Beginner",
			gems: 0,
			timezone: "UTC",
			role: UserRole.USER,
		});
		this.userStreakRepository.save({
			userId: user.id,
		});

		return await this.userRepository.save(user);
	}

	async updatePassword(id: string, newPassword: string) {
		const hashedPassword = await hashPassword(newPassword);
		await this.userRepository.update(id, { password: hashedPassword });
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto) {
		const { username } = updateUserDto;
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException(USER_ERRORS.NOT_FOUND);
		}
		if (username && (await this.isUsernameExists(username))) {
			throw new BadRequestException(USER_ERRORS.USERNAME_IN_USE);
		}
		await this.userRepository.update(id, updateUserDto);
	}

	async findByUsername(username: string) {
		const existingUser = await this.userRepository.findOne({
			where: { username },
		});
		return existingUser;
	}

	async findByEmail(email: string) {
		const existingUser = await this.userRepository.findOne({
			where: { email },
		});
		return existingUser;
	}

	async isEmailExists(email: string) {
		const existingUser = await this.userRepository.exists({
			where: { email },
		});
		return existingUser;
	}

	async isUsernameExists(username: string) {
		const existingUser = await this.userRepository.exists({
			where: { username },
		});
		return existingUser;
	}

	async findById(id: string) {
		const existingUser = await this.userRepository.findOne({
			where: { id: id },
		});
		return existingUser;
	}
}
