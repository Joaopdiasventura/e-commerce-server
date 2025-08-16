interface IAppConfig {
  app: {
    port: number;
    url: string;
  };
  client: {
    url: string;
  };
  jwt: {
    secret: string;
  };
  email: {
    address: string;
    password: string;
  };
  mp: {
    accessToken: string;
    publicKey: string;
  };
  salts: number;
  env: string;
}

export const AppConfig = (): IAppConfig => ({
  app: {
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000,
    url: process.env.APP_URL ?? "http://localhost:3000",
  },
  client: {
    url: process.env.CLIENT_URL ?? "http://localhost:4200",
  },
  jwt: {
    secret: process.env.JWT_URL ?? "commerc",
  },
  email: {
    address: process.env.EMAIL_ADDRESS!,
    password: process.env.EMAIL_PASSWORD!,
  },
  mp: {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    publicKey: process.env.MERCADOPAGO_PUCLIC_KEY!,
  },
  salts: process.env.SALTS ? parseInt(process.env.SALTS) : 5,
  env: process.env.NODE_ENV ?? "development",
});
