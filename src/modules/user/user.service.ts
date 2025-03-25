import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRole } from "../../entities/user.entity";
import { Repository } from "typeorm";
import { hashPassword } from "src/utils/handle-password.util";
import { RedisService } from "../cache/cache.service";
// import aqp from 'api-query-params';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private redisService: RedisService,
	) {}

	async createUser(dto: CreateUserDto) {
		const existingUser = await this.userRepository.findOne({
			where: { email: dto.email },
		});
		if (existingUser) {
			throw new BadRequestException("Email already in use");
		}

		console.log(dto.password);
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

		return await this.userRepository.save(user);
	}

	async findByUsername(username: string) {
		const existingUser = await this.userRepository.findOne({
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
