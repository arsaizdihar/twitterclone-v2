import createHandler from "~/server/createHandler";
import authOnly from "~/server/middlewares/authOnly";
import db from "~/server/prisma";
import { getUserId } from "~/server/user";

const handler = createHandler();

handler.post(authOnly, async (req, res) => {
  const userId = getUserId(req, res)!;
  const { tweetId } = req.body;
  if (typeof tweetId !== "string") {
    res.status(400).send({
      error: "Invalid tweetId",
    });
    return;
  }
  const isLiked =
    (await db.tweet.count({
      where: {
        likes: {
          some: {
            userId,
          },
        },
        id: tweetId,
      },
    })) > 0;
  try {
    await db.tweet.update({
      where: { id: tweetId },
      select: {
        id: true,
      },
      data: {
        likes: {
          create: !isLiked
            ? {
                userId,
              }
            : undefined,
          delete: isLiked
            ? {
                tweetId_userId: {
                  userId,
                  tweetId,
                },
              }
            : undefined,
        },
      },
    });
    return res.status(200).json({ isLiked: !isLiked });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: "Tweet not found" });
  }
});

export default handler;
