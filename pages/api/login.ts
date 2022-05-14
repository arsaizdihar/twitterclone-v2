import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import db from "~/server/prisma";
import signJWT from "~/server/signJWT";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { username, password } = req.body;
  const user = await db.user.findFirst({
    where: { OR: [{ username }, { email: username }] },
    select: { password: { select: { hash: true } }, id: true },
    rejectOnNotFound: false,
  });
  if (!user) {
    return res.status(404).json({ statusCode: 404, message: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password?.hash!);

  if (!isMatch) {
    return res
      .status(401)
      .json({ statusCode: 401, message: "Invalid password" });
  }
  signJWT(user, req, res);
  return res.status(200).json({ status: "Success" });
});

export default handler;
