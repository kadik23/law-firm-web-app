import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../interfaces/User';
dotenv.config();

const authMiddleware = (roles: string[] = []): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    let authToken = req.cookies.authToken;
    
    // If no cookie token, check Authorization header
    if (!authToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    console.log("authToken:", authToken);

    if (!authToken) {
      res.status(401).json({ error: "Unauthorized - Missing Token" });
      return;
    }

    try {
      const data = jwt.verify(authToken, process.env.SECRET as string) as JwtPayload & { user?: IUser };

      if (!data.user) {
        res.status(401).json({ error: "Unauthorized - Invalid Token" });
        return;
      }

      const { password, ...filteredUserData } = data.user;
      req.user = filteredUserData as IUser;

      if (roles.length > 0 && !roles.includes(data.user.type)) {
        res.status(403).json({ error: "Forbidden - Insufficient Role" });
        return;
      }

      console.log("Authorized user:", data.user);
      next();
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'name' in error && (error as any).name === "TokenExpiredError") {
        res.status(401).json({ error: "Unauthorized - Token Expired" });
        return;
      }
      console.error("Error during token verification:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  };
};

export default authMiddleware;