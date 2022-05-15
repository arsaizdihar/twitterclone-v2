import request from "./request";

export function postTweet(text: string) {
  return request({ url: "/api/tweet", method: "POST", body: { text } });
}
