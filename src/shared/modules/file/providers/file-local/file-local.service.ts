import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { mkdir, writeFile, unlink, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { FileStorageProvider } from "..";

@Injectable()
export class FileLocalService implements FileStorageProvider {
  private readonly baseUrl: string;
  private readonly publicPath = "uploads";
  private readonly uploadDir: string;

  public constructor(private readonly config: ConfigService) {
    this.baseUrl =
      this.config.get<string>("app.url") ?? "http://localhost:3000";
    this.uploadDir = resolve(process.cwd(), this.publicPath);
  }

  public async upload(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer?.length) throw new Error("Arquivo inválido");
    await mkdir(this.uploadDir, { recursive: true });
    const safeExt = extname(file.originalname || "")
      .toLowerCase()
      .replace(/[^.\w]/g, "");
    const filename = `${randomUUID()}${safeExt || ""}`;
    const filePath = resolve(this.uploadDir, filename);
    await writeFile(filePath, file.buffer);
    return `${this.baseUrl}/${this.publicPath}/${filename}`;
  }

  public async delete(target: string): Promise<void> {
    const candidate = this.extractFilename(target);
    if (!candidate) return;
    const filePath = resolve(this.uploadDir, candidate);
    if (!existsSync(filePath)) return;
    const st = await stat(filePath);
    if (st.isFile()) await unlink(filePath);
  }

  private extractFilename(target: string): string | null {
    try {
      const u = new URL(target);
      const name = basename(u.pathname);
      return name || null;
    } catch {
      const name = basename(target);
      return name || null;
    }
  }
}
