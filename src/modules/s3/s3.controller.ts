import {
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import {
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { MAX_FILE_SIZE } from "src/constants/file-upload-validate";
import { Public } from "src/decorators/public-route";

import { S3Service } from "./s3.service";

@ApiTags("S3") // Groups all endpoints under "S3" tag in Swagger UI
@Controller("s3")
export class S3Controller {
	constructor(private readonly s3Service: S3Service) {}

	@Public()
	@Post("/file")
	@UseInterceptors(FileInterceptor("file"))
	@ApiOperation({ summary: "Upload a file to S3" })
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary",
				},
				isPublic: {
					type: "string",
					enum: ["true", "false"],
					description: "Whether the file should be publicly accessible",
				},
			},
			required: ["file"],
		},
	})
	@ApiResponse({ status: 201, description: "File successfully uploaded" })
	@ApiResponse({ status: 400, description: "Invalid file type or size" })
	async uploadFile(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
					new MaxFileSizeValidator({
						maxSize: MAX_FILE_SIZE,
						message: "File is too large. Max file size is 5MB",
					}),
				],
				fileIsRequired: true,
			}),
		)
		file: Express.Multer.File,
		@Body("isPublic") isPublic: string,
	) {
		const isPublicBool = isPublic === "true" ? true : false;
		const folder = "";
		return this.s3Service.uploadSingleFile({
			file,
			isPublic: isPublicBool,
			folder,
		});
	}

	@Public()
	@Get(":key")
	@ApiOperation({ summary: "Get file URL from S3" })
	@ApiParam({ name: "key", description: "S3 object key", type: "string" })
	@ApiResponse({ status: 200, description: "Returns the file URL" })
	@ApiResponse({ status: 404, description: "File not found" })
	async getFileUrl(@Param("key") key: string) {
		return this.s3Service.getFileUrl(key);
	}

	@Public()
	@Get("/signed-url/:key")
	@ApiOperation({ summary: "Get presigned URL for S3 file" })
	@ApiParam({ name: "key", description: "S3 object key", type: "string" })
	@ApiResponse({ status: 200, description: "Returns the presigned URL" })
	@ApiResponse({ status: 404, description: "File not found" })
	async getSingedUrl(@Param("key") key: string) {
		return this.s3Service.getPresignedSignedUrl(key);
	}

	@Public()
	@Delete(":key")
	@ApiOperation({ summary: "Delete file from S3" })
	@ApiParam({ name: "key", description: "S3 object key", type: "string" })
	@ApiResponse({ status: 200, description: "File successfully deleted" })
	@ApiResponse({ status: 404, description: "File not found" })
	async deleteFile(@Param("key") key: string) {
		return this.s3Service.deleteFile(key);
	}

	@Public()
	@Post("/presigned-upload")
	@ApiOperation({ summary: "Get presigned URL for uploading to S3" })
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				contentType: {
					type: "string",
					description: "MIME type of the file to be uploaded",
					example: "image/jpeg",
				},
				folder: {
					type: "string",
					description: "Optional folder path in S3 bucket",
					example: "users/avatars",
				},
				fileName: {
					type: "string",
					description:
						"Optional custom file name (UUID will be used if not provided)",
					example: "profile-picture.jpg",
				},
			},
			required: ["contentType, fileName"],
		},
	})
	@ApiResponse({
		status: 201,
		description:
			"Returns presigned URL for upload and public URL for future access",
		schema: {
			type: "object",
			properties: {
				url: {
					type: "string",
					description: "Presigned URL to upload the file",
				},
				key: {
					type: "string",
					description: "S3 object key/path",
				},
				publicUrl: {
					type: "string",
					description:
						"Public URL where the file will be accessible after upload",
				},
			},
		},
	})
	@ApiResponse({ status: 400, description: "Invalid request parameters" })
	async getPresignedUploadUrl(
		@Body()
		options: {
			contentType: string;
			folder?: string;
			fileName?: string;
		},
	) {
		return this.s3Service.getPresignedUploadUrl(options);
	}
}
