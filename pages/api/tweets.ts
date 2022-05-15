import createHandler from "~/server/createHandler";
import db from "~/server/prisma";
import { getUserId, SIMPLE_USER_QUERY } from "~/server/user";

const handler = createHandler();
handler.get(async (req, res) => {
  try {
    let cursor = req.query.cursor;
    let username = req.query.username;
    let replyTo = req.query.replyTo;
    if (typeof cursor !== "string") {
      cursor = "";
    }
    if (typeof username !== "string") {
      username = "";
    }
    if (typeof replyTo !== "string") {
      replyTo = "";
    }
    const userId = getUserId(req, res);

    let query: any = {};

    if (username) {
      const user = await db.user.findUnique({
        where: { username },
        select: {
          private: true,
          id: true,
          followers: userId
            ? {
                where: {
                  id: userId,
                },
              }
            : undefined,
        },
      });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      if (user.private && !user.followers.length) {
        return res.status(404).send({ error: "User is private" });
      }
      query = {
        commentTo: null,
        userId: user.id,
      };
    } else if (replyTo) {
      query = {
        commentTo: { id: replyTo },
      };
    } else {
      query = {
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
      };
    }
    const [tweets, count] = await Promise.all([
      db.tweet.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: cursor ? 1 : 0,
        where: query,
        include: {
          media: { select: { id: true, url: true } },
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
      }),
      db.tweet.count({ where: query }),
    ]);
    return res.json({
      tweets: tweets.map((t) => ({
        ...t,
        likes: undefined,
        isLiked: t.likes.length > 0,
      })),
      count,
    });
  } catch (error) {
    console.log(error);
    return res.json([]);
  }
});

export default handler;
