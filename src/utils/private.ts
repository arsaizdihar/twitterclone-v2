import db from "~/server/prisma";

export async function canAccessAccount(
  toUsername: string,
  fromId: string | null
) {
  const user = await db.user.findUnique({
    where: { username: toUsername },
    select: {
      followers: fromId
        ? {
            where: {
              id: fromId,
            },
            select: { id: true },
          }
        : false,
      id: true,
      private: true,
    },
  });
  if (!user) {
    return false;
  }
  if (user.private) {
    return fromId === user.id || (fromId && user.followers.length > 0);
  }
  return true;
}
