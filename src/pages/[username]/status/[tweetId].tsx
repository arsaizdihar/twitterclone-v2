import BasicLayout from "~/components/BasicLayout";
import Head from "~/components/Head";
import { usePageData } from "~/components/PageDataContext";
import TweetDetail from "~/components/tweet/TweetDetail";
import db from "~/server/prisma";
import { getUserId, SIMPLE_USER_QUERY } from "~/server/user";
import { withSession } from "~/server/withSession";
import { ITweet } from "~/type";
import { canAccessAccount } from "~/utils/private";

export const getServerSideProps = withSession({
  force: false,
  handler: async (ctx) => {
    const username = ctx.query.username as string;
    const tweetId = ctx.query.tweetId as string;
    const userId = getUserId(ctx.req, ctx.res);
    if (!(await canAccessAccount(username, userId))) {
      return {
        notFound: true,
      };
    }

    const tweet = await db.tweet.findFirst({
      where: {
        id: tweetId,
        user: {
          username,
        },
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

    if (!tweet) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        data: JSON.parse(
          JSON.stringify({ ...tweet, isLiked: tweet.likes.length > 0 })
        ),
      },
    };
  },
});
const TweetDetailPage = () => {
  const tweet = usePageData<ITweet>();
  return (
    <>
      <Head
        title={`${tweet.user.username || "Tweet"} | Twitter Clone`}
        description={`${tweet.text || "Tweet text"}`}
        imageURL={tweet.user.photoUrl || undefined}
      ></Head>
      <TweetDetail data={tweet} />
    </>
  );
};

TweetDetailPage.Layout = BasicLayout;

export default TweetDetailPage;
