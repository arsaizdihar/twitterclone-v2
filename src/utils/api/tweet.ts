import request from "./request";

export function postTweet(data: FormData) {
  return request({
    url: "/api/tweet",
    method: "POST",
    body: data,
  });
}

export function likeTweet(tweetId: string) {
  return request({ url: `/api/tweet/like`, method: "POST", body: { tweetId } });
}

export function deleteTweet(tweetId: string) {
  return request({ url: `/api/tweet/${tweetId}`, method: "DELETE" });
}
