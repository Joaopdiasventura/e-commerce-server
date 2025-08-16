import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppConfig } from "./config/app.config";
import { DatabaseConfig } from "./config/db.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoreModule } from "./core/core.module";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [AppConfig, DatabaseConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>("postgres.url"),
        synchronize: configService.get<string>("env") != "production",
        logging: configService.get<string>("env") != "production",
        type: "postgres",
        autoLoadEntities: true,
        entities: [__dirname + "/**/*.entity.ts"],
      }),
    }),
    CoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
