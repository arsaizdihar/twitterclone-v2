import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { ITweet } from "~/type";
import { request } from "~/utils/api";

function getKey(
  type: "timeline" | "replies" | "profile",
  replyTo?: string,
  username?: string
) {
  if (type === "timeline") return "tweets";
  if (type === "replies") return ["replies", replyTo];
  else return ["profileTweets", username];
}

function useTweets({
  type,
  replyTo,
  username,
}: {
  type: "timeline" | "replies" | "profile";
  replyTo?: string;
  username?: string;
}) {
  const res = useInfiniteQuery<{
    tweets: ITweet[];
    count: number;
  }>(
    getKey(type, replyTo, username),
    ({ pageParam }) => {
      const searchParams = new URLSearchParams();
      if (typeof pageParam === "string") {
        searchParams.set("cursor", pageParam);
      }
      if (typeof replyTo === "string") {
        searchParams.set("replyTo", replyTo);
      }
      if (typeof username === "string") {
        searchParams.set("username", username);
      }
      return request({
        url: `/api/tweets?${searchParams.toString()}`,
        method: "GET",
      });
    },
    {
      refetchOnMount: false,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.tweets.length === 0 || allPages.length * 10 >= lastPage.count
          ? undefined
          : lastPage.tweets[lastPage.tweets.length - 1].id,
      getPreviousPageParam: (lastPage, allPages) => {
        const page = allPages.length - 1;
        if (page > 0) return page;
        return undefined;
      },
    }
  );

  const { isFetchingNextPage, fetchNextPage } = res;
  useEffect(() => {
    function listener() {
      if (isFetchingNextPage) return;
      const body = document.body,
        html = document.documentElement;
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      if (window.scrollY + window.innerHeight === height) {
        fetchNextPage();
      }
    }
    window.addEventListener("scroll", listener);
    return () => {
      console.log("destroyed");
      window.removeEventListener("scroll", listener);
    };
  }, [fetchNextPage, isFetchingNextPage]);
  return res;
}

export default useTweets;
