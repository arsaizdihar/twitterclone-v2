import createHandler from "~/server/createHandler";
import authOnly from "~/server/middlewares/authOnly";
import db from "~/server/prisma";
import { getUserId, SIMPLE_USER_QUERY } from "~/server/user";

const handler = createHandler();

handler.post(authOnly, async (req, res) => {
  const userId = getUserId(req, res)!;
  let replyTo = req.body.replyTo as string;
  if (typeof replyTo !== "string") {
    replyTo = "";
  }
  const tweet = await db.tweet.create({
    data: {
      text: req.body.text,
      userId,
      commentToId: replyTo || undefined,
    },
    include: {
      user: { select: SIMPLE_USER_QUERY },
      likes: {
        where: {
          userId: userId || undefined,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
          retweets: true,
        },
      },
    },
  });
  return res.status(201).json(tweet);
});

export default handler;
