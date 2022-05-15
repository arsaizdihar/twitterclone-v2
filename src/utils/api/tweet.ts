import request from "./request";

export function postTweet(text: string) {
  return request({ url: "/api/tweet", method: "POST", body: { text } });
}

export function likeTweet(tweetId: string) {
  return request({ url: `/api/tweet/like`, method: "POST", body: { tweetId } });
}
