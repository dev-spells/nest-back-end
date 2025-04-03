import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SpellBook } from "src/entities/spellbook.entity";

import { SpellBookController } from "./spell-book.controller";
import { SpellBookService } from "./spell-book.service";

@Module({
	imports: [TypeOrmModule.forFeature([SpellBook])],
	controllers: [SpellBookController],
	providers: [SpellBookService],
	exports: [SpellBookService],
})
export class SpellBookModule {}
