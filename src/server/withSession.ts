import { User } from "@prisma/client";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import getUser from "./getUser";

type Handler = (
  ctx: GetServerSidePropsContext,
  user: User | null
) => Promise<GetServerSidePropsResult<any>>;

type WithSessionConfig = {
  force?: boolean;
  handler?: Handler;
};

export const withSession =
  ({ force = false, handler }: WithSessionConfig): GetServerSideProps =>
  async (ctx) => {
    const user = await getUser(ctx.req, ctx.res);
    if (!user && force) {
      return {
        redirect: {
          destination: `/login${
            ctx.req.url ? "?callbackUrl=" + ctx.req.url : ""
          }`,
          permanent: false,
        },
      };
    }
    if (handler) {
      const result = await handler(ctx, user);
      if ("props" in result) {
        const props = await result.props;
        return {
          ...result,
          props: {
            user,
            ...props,
          },
        };
      } else return result;
    }

    return { props: { user } };
  };
