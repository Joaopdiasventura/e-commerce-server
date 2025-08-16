import { Test, TestingModule } from "@nestjs/testing";
import { FileLocalService } from "../file-local.service";

describe("FileLocalService", () => {
  let service: FileLocalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileLocalService],
    }).compile();

    service = module.get<FileLocalService>(FileLocalService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
