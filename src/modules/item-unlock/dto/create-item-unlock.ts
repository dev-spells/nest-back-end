import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UseItemUnlockDto {
	@ApiProperty()
	@IsNotEmpty()
	lessonId: number;
}
