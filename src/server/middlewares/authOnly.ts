import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { getUserId } from "../user";

export default function authOnly(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const id = getUserId(req, res);
  if (!id) return res.status(401).json({ message: "Unauthorized" });
  (req as any).userId = id;
  next();
}
