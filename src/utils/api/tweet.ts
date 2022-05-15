import request from "./request";

export function postTweet(text: string, replyTo?: string) {
  return request({
    url: "/api/tweet",
    method: "POST",
    body: { text, replyTo },
  });
}

export function likeTweet(tweetId: string) {
  return request({ url: `/api/tweet/like`, method: "POST", body: { tweetId } });
}
