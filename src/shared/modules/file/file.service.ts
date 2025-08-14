import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { FileStorageProvider } from "./providers";

@Injectable()
export class FileService {
  private storage: FileStorageProvider;

  public constructor(
    private readonly configService: ConfigService,
    @Inject("DevelopmentStorage")
    private readonly developmentStorage: FileStorageProvider,
    @Inject("ProductionStorage")
    private readonly productionStorage: FileStorageProvider,
  ) {
    this.storage =
      this.configService.get<string>("env") == "production"
        ? this.productionStorage
        : this.developmentStorage;
  }

  public async upload(file: Express.Multer.File): Promise<string> {
    return this.storage.upload(file);
  }

  public async delete(url: string): Promise<void> {
    return this.storage.delete(url);
  }
}
