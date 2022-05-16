import React from "react";
import BasicLayout from "~/components/BasicLayout";
import Head from "~/components/Head";
import { usePageData } from "~/components/PageDataContext";
import FollowHeader from "~/components/profile/FollowHeader";
import FollowList from "~/components/profile/FollowList";
import db from "~/server/prisma";
import { getUserId } from "~/server/user";
import { withSession } from "~/server/withSession";

type PageData = {
  id: string;
  username: string;
  displayName: string;
  followers: {
    id: string;
    username: string;
    photoUrl: string | null;
    displayName: string;
    isFollowed: boolean;
    isRequested: boolean;
  }[];
};

export const getServerSideProps = withSession({
  force: false,
  handler: async (ctx) => {
    const username = ctx.query.username as string;
    const userId = getUserId(ctx.req, ctx.res);
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        followers: {
          select: {
            id: true,
            username: true,
            photoUrl: true,
            displayName: true,
            followers: userId
              ? {
                  where: {
                    id: userId,
                  },
                  select: {
                    id: true,
                  },
                }
              : undefined,
            followerRequests: userId
              ? {
                  where: {
                    id: userId,
                  },
                  select: {
                    id: true,
                  },
                }
              : undefined,
          },
        },
      },
    });
    if (!user) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        data: JSON.parse(
          JSON.stringify({
            ...user,
            followers: user.followers.map((f) => ({
              ...f,
              isFollowed: f.followers && f.followers.length > 0,
              isRequested: f.followerRequests && f.followerRequests.length > 0,
            })),
          })
        ),
      },
    };
  },
});

const Followers = () => {
  const user = usePageData<PageData>();
  return (
    <>
      <Head
        title={`People following ${user.displayName} (@${user.username}) | Twitter Clone`}
        description={`People following ${user.displayName} (@${user.username}).`}
      ></Head>
      <div className="max-w-[598px] flex-grow">
        <FollowHeader user={user} />
        <FollowList followLists={user.followers} />
      </div>
    </>
  );
};

Followers.Layout = BasicLayout;
export default Followers;
