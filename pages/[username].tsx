import { GetServerSideProps } from "next";
import React from "react";
import { useUser } from "~/components/AuthContext";
import BasicLayout from "~/components/BasicLayout";
import Head from "~/components/Head";
import { usePageData } from "~/components/PageDataContext";
import Profile from "~/components/profile/Profile";
import db from "~/server/prisma";
import { getUserId } from "~/server/user";
import { withSession } from "~/server/withSession";
import { IUserProfile } from "~/type";

export const getServerSideProps: GetServerSideProps = withSession({
  force: false,
  handler: async (ctx) => {
    const userId = getUserId(ctx.req, ctx.res);
    const user = await db.user.findUnique({
      where: { username: ctx.query.username as string },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            tweets: true,
          },
        },
        followers: userId
          ? {
              where: {
                id: userId,
              },
              select: { id: true },
            }
          : undefined,
      },
    });
    if (!user) {
      return {
        notFound: true,
      };
    }
    if (user.private) {
      if (userId === user.id || (userId && user.followers.length > 0)) {
        return {
          props: {
            data: user,
          },
        };
      }
      return {
        notFound: true,
      };
    }
    return {
      props: {
        data: JSON.parse(JSON.stringify(user)),
      },
    };
  },
});

function UserProfile() {
  const userProfile = usePageData<IUserProfile>();
  const user = useUser();
  return (
    <>
      <Head
        title={`${userProfile.displayName || "Profile"} (@${
          userProfile.username || ""
        }) | Twitter Clone`}
        description={`The latest Tweets from ${
          userProfile.displayName || ""
        } (@${userProfile.username || ""}). ${userProfile.bio}`}
        imageURL={userProfile.photoUrl || undefined}
      ></Head>
      <Profile
        isCurrentUser={userProfile.username === user?.username}
        username={userProfile.username}
        user={userProfile}
      />
    </>
  );
}

UserProfile.Layout = BasicLayout;

export default UserProfile;
