import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configServer = app.get(ConfigService);
	const port = configServer.get("PORT") || 8080;

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			// whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	app.useGlobalInterceptors(
		new ClassSerializerInterceptor(app.get(Reflector), {
			excludeExtraneousValues: true,
		}),
	);

	app.enableCors();

	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle("DevSpells API docs")
		.setDescription("Where all the magic comefrom")
		.setVersion("1.0")
		.addTag("DevSpells")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document, {
		swaggerOptions: { persistAuthorization: true },
	});

	await app.listen(port);
}
bootstrap();
