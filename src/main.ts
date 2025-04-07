import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as basicAuth from "express-basic-auth";
import * as morgan from "morgan";

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { useContainer } from "class-validator";

import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configServer = app.get(ConfigService);
	const port = configServer.get("PORT") || 8080;
	const password = configServer.get("AUTH_PASSWORD");

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			// whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);
	app.use(morgan("tiny"));
	app.use(
		"/api", // Protect this route
		basicAuth({
			users: { admin: password }, // Set your username and password
			challenge: true,
			realm: "DevSpells API",
		}),
	);
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	// app.useGlobalInterceptors(
	// 	new ClassSerializerInterceptor(app.get(Reflector), {
	// 		excludeExtraneousValues: true,
	// 	}),
	// );

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
		customSiteTitle: "DevSpells API docs",
		customfavIcon:
			"https://dev-spells.s3.amazonaws.com/bf3d2f8b-5346-4557-a71e-02c8317ad509",
	});

	await app.listen(port);
}
bootstrap();
