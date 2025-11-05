import { CookieOptions, Response } from "express";

// Interface for tokens
interface ITokens {
  accessToken?: string;
  refreshToken?: string;
}

// Cookie options
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

// Set tokens in cookie
export const setCookies = (res: Response, tokens: ITokens) => {
  if (tokens?.accessToken) {
    res.cookie("accessToken", tokens.accessToken, cookieOptions);
  }

  if (tokens?.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
  }
};

// Clear tokens from cookie
export const clearCookies = (res: Response) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};
