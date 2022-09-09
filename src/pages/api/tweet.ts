import formidable from "formidable";
import fs from "fs";
import createHandler from "~/server/createHandler";
import authOnly from "~/server/middlewares/authOnly";
import db from "~/server/prisma";
import { s3 } from "~/server/s3";
import { getUserId, SIMPLE_USER_QUERY } from "~/server/user";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = createHandler();

handler.post(authOnly, async (req, res) => {
  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(req, async (err, fields, filesData) => {
    const files = filesData.files
      ? Array.isArray(filesData.files)
        ? filesData.files
        : [filesData.files]
      : undefined;
    const urls: string[] = [];
    if (files) {
      const results = await Promise.all(
        files.map((file) => {
          const fileStream = fs.createReadStream(file.filepath);
          return s3
            .upload({
              Bucket: "twitter",
              Key:
                new Date().getTime().toString() +
                "-" +
                (file.originalFilename || "." + file.mimetype?.split("/")[1]),
              Body: fileStream,
              ACL: "public-read",
              ContentType: file.mimetype || undefined,
            })
            .promise();
        })
      );
      results.forEach((result) => {
        urls.push(result.Location);
      });
    }
    const userId = getUserId(req, res)!;
    let replyTo = fields.replyTo as string;
    if (typeof replyTo !== "string") {
      replyTo = "";
    }
    const tweet = await db.tweet.create({
      data: {
        text: fields.text as string,
        userId,
        commentToId: replyTo || undefined,
        media: { createMany: { data: urls.map((url) => ({ url, userId })) } },
      },
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
    });
    return res.status(201).json(tweet);
  });
});

export default handler;
