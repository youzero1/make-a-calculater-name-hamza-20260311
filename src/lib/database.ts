import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Calculation } from '../entities/Calculation';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/prime.db';
const resolvedDbPath = path.resolve(process.cwd(), dbPath);
const dbDir = path.dirname(resolvedDbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

declare global {
  // eslint-disable-next-line no-var
  var __dataSource: DataSource | undefined;
}

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: resolvedDbPath,
  synchronize: true,
  logging: false,
  entities: [Calculation],
});

export async function getDataSource(): Promise<DataSource> {
  if (global.__dataSource && global.__dataSource.isInitialized) {
    return global.__dataSource;
  }
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  global.__dataSource = AppDataSource;
  return AppDataSource;
}

export { AppDataSource };
