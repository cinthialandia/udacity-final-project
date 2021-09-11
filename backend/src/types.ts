import { JwtHeader } from "jsonwebtoken";

export * from "../../shared/types";

/**
 * A payload of a JWT token
 */
export interface JwtPayload {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
}

/**
 * Interface representing a JWT token
 */
export interface Jwt {
  header: JwtHeader;
  payload: JwtPayload;
}
