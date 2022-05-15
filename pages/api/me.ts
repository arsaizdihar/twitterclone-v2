import createHandler from "~/server/createHandler";
import { getUser } from "~/server/user";

const handler = createHandler();

handler.get(async (req, res) => {
  const user = await getUser(req, res);

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  return res.json(user);
});

export default handler;
