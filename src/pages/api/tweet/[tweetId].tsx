import createHandler from "~/server/createHandler";
import authOnly from "~/server/middlewares/authOnly";
import db from "~/server/prisma";
import { s3 } from "~/server/s3";
import { getUserId } from "~/server/user";

const handler = createHandler();

function urlToKey(url: string) {
  if (
    url.startsWith(
      `https://${process.env.S3_PUBLIC_DOMAIN}/${process.env.S3_BUCKET}/`
    )
  ) {
    return url.replace(
      `https://${process.env.S3_PUBLIC_DOMAIN}/${process.env.S3_BUCKET}/`,
      ""
    );
  } else {
    return url.replace(
      `https://${process.env.S3_BUCKET}/${process.env.S3_PUBLIC_DOMAIN}/`,
      ""
    );
  }
}

handler.delete(authOnly, async (req, res) => {
  const userId = getUserId(req, res)!;
  const tweetId = req.query.tweetId as string;
  const medias = await db.media.findMany({ where: { tweetId } });
  const [result, tweet, media] = await Promise.all([
    s3
      .deleteObjects({
        Bucket: process.env.S3_BUCKET!,
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
