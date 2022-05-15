import bcrypt from "bcryptjs";
import createHandler from "~/server/createHandler";
import db from "~/server/prisma";
import signJWT from "~/server/signJWT";

const handler = createHandler();

handler.post(async (req, res) => {
  const user = await db.user.create({
    data: {
      displayName: req.body.displayName,
      username: req.body.username,
      email: req.body.email,
      password: {
        create: {
          hash: await bcrypt.hash(req.body.password, 10),
        },
      },
    },
  });
  signJWT(user, req, res);
  return res.status(201).json(user);
});

export default handler;
