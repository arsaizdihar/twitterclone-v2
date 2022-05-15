import createHandler from "~/server/createHandler";
import db from "~/server/prisma";
import { getUserId, SIMPLE_USER_QUERY } from "~/server/user";

const handler = createHandler();
handler.get(async (req, res) => {
  const userId = getUserId(req, res);
  const tweets = await db.tweet.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      commentTo: null,
      user: {
        OR: [
          { id: userId || undefined },
          {
            followers: {
              some: {
                id: userId || undefined,
              },
            },
          },
        ],
      },
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
  return res.json(
    tweets.map((t) => ({ ...t, likes: undefined, isLiked: t.likes.length > 0 }))
  );
});

export default handler;
