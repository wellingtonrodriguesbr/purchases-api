import { DataSource } from "typeorm";
import { env } from "@/common/infra/env";

export const testDataSource = new DataSource({
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  schema: env.DB_SCHEMA,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: ["**/entities/**/*.ts"],
  migrations: ["**/migrations/**/*.ts"],
});
