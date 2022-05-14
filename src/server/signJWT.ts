import { setCookies } from "cookies-next";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import config from "./config";

const signJWT = (
  user: { id: string },
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const now = new Date().getTime();
  const expiresTime = now + config.token.expireTime * 1000;
  const expires = new Date(expiresTime);

  try {
    const token = jwt.sign({ id: user.id }, config.token.secret, {
      issuer: config.token.issuer,
      algorithm: "HS256",
      expiresIn: config.token.expireTime,
    });
    setCookies("token", token, {
      httpOnly: true,
      secure: !config.DEV,
      expires,
      sameSite: "strict",
      req,
      res,
    });
  } catch (err) {
    console.error(err);
  }
};

export default signJWT;
