import createHandler from "~/server/createHandler";
import authOnly from "~/server/middlewares/authOnly";
import db from "~/server/prisma";
import { getUserId, SIMPLE_USER_QUERY } from "~/server/user";

const handler = createHandler();

handler.get(authOnly, async (req, res) => {
  const userId = getUserId(req, res)!;
  const users = await db.user.findMany({
    where: {
      AND: [
        { NOT: { id: userId } },
        {
          followers: {
            every: {
              NOT: {
                id: userId,
              },
            },
          },
        },
      ],
    },
    select: SIMPLE_USER_QUERY,
  });
  return res.json(users);
});

export default handler;
