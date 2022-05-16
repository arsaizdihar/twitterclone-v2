import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

export default function createHandler() {
  return nextConnect<NextApiRequest, NextApiResponse>({
    onError: (error, req, res) => {
      res.status(500);
      res.json({ error: error.message });
    },
  });
}
