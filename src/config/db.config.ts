interface IDatabaseConfig {
  postgres: {
    url: string;
  };
}
export const DatabaseConfig = (): IDatabaseConfig => ({
  postgres: {
    url:
      process.env.DATABASE_URL ??
      "postgres://postgres:postgres@localhost:5432/e_commerce",
  },
});
