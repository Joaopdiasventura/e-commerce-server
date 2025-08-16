import { Test, TestingModule } from "@nestjs/testing";
import { FileAwsService } from "../file-aws.service";

describe("FileAwsService", () => {
  let service: FileAwsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileAwsService],
    }).compile();

    service = module.get<FileAwsService>(FileAwsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
