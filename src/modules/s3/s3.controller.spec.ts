import { Test, TestingModule } from "@nestjs/testing";
import { S3Service } from "./s3.service";
import { ConfigService } from "@nestjs/config";

// Mock AWS SDK
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

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				S3Service,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn().mockReturnValue("mock-value"),
					},
				},
			],
		}).compile();

		service = module.get<S3Service>(S3Service);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
