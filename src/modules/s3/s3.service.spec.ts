import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { S3Service } from "./s3.service";
import { S3Client } from "@aws-sdk/client-s3";

// Add mock for S3Client
jest.mock("@aws-sdk/client-s3", () => ({
	S3Client: jest.fn().mockImplementation(() => ({
		send: jest.fn().mockResolvedValue({}),
	})),
	PutObjectCommand: jest.fn(),
	GetObjectCommand: jest.fn(),
	DeleteObjectCommand: jest.fn(),
}));

describe("S3Service", () => {
	let service: S3Service;
	let configService: ConfigService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				S3Service,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn().mockReturnValue("mock-value"), // This will return "mock-value" for any key
					},
				},
			],
		}).compile();

		service = module.get<S3Service>(S3Service);
		configService = module.get<ConfigService>(ConfigService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
