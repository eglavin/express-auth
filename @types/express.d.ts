import { DataSource } from "typeorm";

declare global {
  namespace Express {
    interface Request {
      context: {
        db: DataSource | null;
      };
    }
  }
}
