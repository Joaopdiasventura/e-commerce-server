import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileStorageProvider } from "..";

@Injectable()
export class FileAwsService implements FileStorageProvider {
  private s3: S3Client;
  private bucket: string;
  private region: string;

  public constructor(private readonly configService: ConfigService) {
    if (this.configService.get<string>("env") != "production") return;
    this.region = this.configService.get<string>("aws.region")!;
    this.bucket = this.configService.get<string>("aws.s3Bucket")!;
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>("aws.accessKeyId")!,
        secretAccessKey: this.configService.get<string>("aws.secretAccessKey")!,
      },
    });
  }

  public async upload(file: Express.Multer.File): Promise<string> {
    const key = `${Date.now()}-${file.originalname}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: Buffer.from(file.buffer),
        ContentType: file.mimetype,
      }),
    );
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  public async delete(target: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: new URL(target).pathname.substring(1),
      }),
    );
  }
}
