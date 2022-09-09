import createHandler from "~/server/createHandler";
import authOnly from "~/server/middlewares/authOnly";
import db from "~/server/prisma";
import { s3 } from "~/server/s3";
import { getUserId } from "~/server/user";

const handler = createHandler();

function urlToKey(url: string) {
  if (url.startsWith("https://is3.cloudhost.id/twitter/")) {
    return url.replace("https://is3.cloudhost.id/twitter/", "");
  } else {
    return url.replace("https://twitter.is3.cloudhost.id/", "");
  }
}

handler.delete(authOnly, async (req, res) => {
  const userId = getUserId(req, res)!;
  const tweetId = req.query.tweetId as string;
  const medias = await db.media.findMany({ where: { tweetId } });
  const [result, tweet, media] = await Promise.all([
    s3
      .deleteObjects({
        Bucket: "twitter",
        Delete: { Objects: medias.map((m) => ({ Key: urlToKey(m.url) })) },
      })
      .promise(),
    db.tweet.deleteMany({ where: { id: tweetId, userId } }),
    db.media.deleteMany({ where: { tweetId } }),
  ]);
  if (tweet.count === 0)
    return res.status(404).json({ error: "Tweet not found" });
  return res.json({ success: true });
});

export default handler;
