import createHandler from "~/server/createHandler";
import authOnly from "~/server/middlewares/authOnly";
import db from "~/server/prisma";
import { getUserId } from "~/server/user";

const handler = createHandler();

handler.post(authOnly, async (req, res) => {
  try {
    const userId = getUserId(req, res)!;
    const requestedId = req.body.userId;
    if (typeof requestedId !== "string")
      return res.status(400).json({ error: "userId is required" });
    const [requestedUser, user] = await Promise.all([
      db.user.findUnique({
        where: { id: requestedId },
        select: {
          private: true,
        },
      }),
      db.user.findUnique({
        where: { id: userId },
        select: {
          following: {
            where: {
              id: requestedId,
            },
            select: { id: true },
          },
          followingRequests: {
            where: {
              id: requestedId,
            },
            select: { id: true },
          },
        },
        rejectOnNotFound: true,
      }),
    ]);
    if (!requestedUser)
      return res.status(404).json({ error: "user not found" });
    if (!user.following.length && !user.followingRequests.length) {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          followingRequests: requestedUser.private
            ? {
                connect: {
                  id: requestedId,
                },
              }
            : undefined,
          following: !requestedUser.private
            ? {
                connect: {
                  id: requestedId,
                },
              }
            : undefined,
        },
        select: { id: true },
      });
      return res.status(201).json({
        followed: !requestedUser.private,
        requested: requestedUser.private,
      });
    }
    await db.user.update({
      where: { id: userId },
      data: {
        followingRequests:
          user.following.length > 0
            ? {
                disconnect: {
                  id: requestedId,
                },
              }
            : undefined,
        following:
          user.following.length > 0
            ? {
                disconnect: {
                  id: requestedId,
                },
              }
            : undefined,
      },
    });
    return res.status(200).json({
      unfollowed: user.following.length > 0,
      unrequested: user.followingRequests.length > 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default handler;
