import createHandler from "~/server/createHandler";
import authOnly from "~/server/middlewares/authOnly";
import db from "~/server/prisma";
import { getUserId } from "~/server/user";

const handler = createHandler();

handler.post(authOnly, async (req, res) => {
  const userId = getUserId(req, res)!;
  const tweet = await db.tweet.create({
    data: {
      text: req.body.text,
      userId,
    },
  });
  return res.status(201).json(tweet);
});

export default handler;
