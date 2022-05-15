import React from "react";
import useTweets from "~/hooks/useTweets";
import { ITweet } from "~/type";
import { useUser } from "../AuthContext";
import ReplyInput from "./ReplyInput";
import Tweet from "./Tweet";

interface Props {
  data: ITweet;
}

const TweetDetail: React.FC<Props> = ({ data }) => {
  const user = useUser();
  const { data: tweetsData } = useTweets({ type: "replies", replyTo: data.id });

  return (
    <div className="bg-gray-100 dark:bg-black dark:border dark:border-gray_dark max-w-[600px] flex-grow min-h-screen main-border">
      <Tweet tweet={data} />
      {user !== null ? (
        <ReplyInput tweetUser={data.user} tweetId={data.id} />
      ) : (
        <h4 className="text-center bg-white mx-1 text-gray-400 p-2">
          Login to reply
        </h4>
      )}
      {tweetsData?.pages.map((page) =>
        page.tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />)
      )}
    </div>
  );
};

export default TweetDetail;
