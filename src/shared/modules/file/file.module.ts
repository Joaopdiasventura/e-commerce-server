import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileLocalService } from "./providers/file-local/file-local.service";
import { FileAwsService } from "./providers/file-aws/file-aws.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [
    FileService,
    { provide: "DevelopmentStorage", useClass: FileLocalService },
    { provide: "ProductionStorage", useClass: FileAwsService },
  ],
  exports: [FileService],
})
export class FileModule {}
