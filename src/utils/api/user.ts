import request from "./request";

export function follow(userId: string) {
  return request({ url: "/api/user/follow", method: "POST", body: { userId } });
}
