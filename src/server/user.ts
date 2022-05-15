import { getCookie } from "cookies-next";
import { OptionsType } from "cookies-next/lib/types";
import jwt from "jsonwebtoken";
import config from "./config";
import prisma from "./prisma";

export const SIMPLE_USER_QUERY = {
  id: true,
  username: true,
  email: true,
  displayName: true,
  private: true,
  verified: true,
  photoUrl: true,
} as const;

export const getUserId = (req: OptionsType["req"], res: OptionsType["res"]) => {
  const id = (req as any).userId;
  if (id) return id as string;
  const token = getCookie("token", { req, res });
  if (!token || typeof token !== "string") return null;
  try {
    const decoded = jwt.verify(token, config.token.secret);
    if (typeof decoded !== "object") return null;
    return decoded.id as string;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUser = async (
  req: OptionsType["req"],
  res: OptionsType["res"]
) => {
  const id = getUserId(req, res);
  if (!id) return null;
  const user = await prisma.user.findUnique({
    where: { id },
    select: SIMPLE_USER_QUERY,
  });
  return user;
};
