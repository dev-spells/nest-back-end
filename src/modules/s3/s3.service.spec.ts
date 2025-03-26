import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { S3Service } from "./s3.service";

describe("S3Service", () => {
	let service: S3Service;
	let configService: ConfigService;

	const mockConfigService = {
		get: jest.fn((key: string) => {
			switch (key) {
				case "S3_REGION":
					return "test-region";
				case "S3_BUCKET_NAME":
					return "test-bucket";
				case "IAM_ACCESS_KEY":
					return "test-access-key";
				case "IAM_SECRET_KEY":
					return "test-secret-key";
				default:
					return null;
			}
		}),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				S3Service,
				{
					provide: ConfigService,
					useValue: mockConfigService,
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
