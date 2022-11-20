import { DataSource } from "typeorm";

declare global {
  namespace Express {
    interface Request {
      context: {
        db: DataSource | null;
      };
      token?: {
        data: {
          id: number;
          email: string;
        };
        iat: number;
        exp: number;
      };
      currentUser?: {
        id: string;
        email: string;
        profile: any;
      };
    }
  }
}
