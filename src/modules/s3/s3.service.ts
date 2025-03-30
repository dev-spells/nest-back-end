import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class S3Service {
	private readonly client: S3Client;
	private readonly bucketName: string;

	constructor(private readonly configService: ConfigService) {
		const s3Region = this.configService.get<string>("S3_REGION");
		const bucketName = this.configService.get<string>("S3_BUCKET_NAME");
		const accessKeyId = this.configService.get<string>("IAM_ACCESS_KEY");
		const secretAccessKey = this.configService.get<string>("IAM_SECRET_KEY");

		// Validate all required configuration values
		if (!s3Region) {
			throw new Error("S3_REGION not found in environment variables");
		}
		if (!accessKeyId) {
			throw new Error("S3_ACCESS_KEY not found in environment variables");
		}
		if (!secretAccessKey) {
			throw new Error(
				"S3_SECRET_ACCESS_KEY not found in environment variables",
			);
		}
		if (!bucketName) {
			throw new Error("S3_BUCKET_NAME not found in environment variables");
		}

		// Assign bucket name to class property
		this.bucketName = bucketName;

		// Initialize S3 client
		this.client = new S3Client({
			region: s3Region,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
			forcePathStyle: true,
		});
	}

	async uploadSingleFile({
		file,
		isPublic = true,
		folder = "",
	}: {
		file: Express.Multer.File;
		isPublic: boolean;
		folder: string;
	}) {
		try {
			const sanitizedFolder = folder.replace(/\/$/, "");
			const key = folder != "" ? `${sanitizedFolder}/${uuidv4()}` : uuidv4();
			const command = new PutObjectCommand({
				Bucket: this.bucketName,
				Key: key,
				Body: file.buffer,
				ContentType: file.mimetype,
				ACL: isPublic ? "public-read" : "private",

				Metadata: {
					originalName: file.originalname,
				},
			});

			await this.client.send(command);

			return {
				url: isPublic
					? (await this.getFileUrl(key)).url
					: (await this.getPresignedSignedUrl(key)).url,
				key,
				isPublic,
			};
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}

	async getFileUrl(key: string) {
		return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
	}

	async getPresignedSignedUrl(key: string, options?: { contentType: string }) {
		try {
			const command = new GetObjectCommand({
				Bucket: this.bucketName,
				Key: key,
				ResponseContentType: options?.contentType,
			});

			const url = await getSignedUrl(this.client, command, {
				expiresIn: 60 * 5,
			});

			return { url };
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}
	async deleteFile(key: string) {
		try {
			const command = new DeleteObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			});

			await this.client.send(command);

			return { message: "File deleted successfully" };
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}
}
