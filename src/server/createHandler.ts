import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

export default function createHandler() {
  return nextConnect<NextApiRequest, NextApiResponse>();
}
