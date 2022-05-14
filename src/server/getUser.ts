import { getCookie } from "cookies-next";
import { OptionsType } from "cookies-next/lib/types";
import jwt from "jsonwebtoken";
import config from "./config";
import prisma from "./prisma";

const getUser = async (req: OptionsType["req"], res: OptionsType["res"]) => {
  const token = getCookie("token", { req, res });
  if (!token || typeof token !== "string") return null;
  try {
    const decoded = jwt.verify(token, config.token.secret);
    if (typeof decoded !== "object") return null;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getUser;
