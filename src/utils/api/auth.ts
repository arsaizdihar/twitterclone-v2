import request from "./request";

export async function register(data: any) {
  return await request({
    url: "/api/auth/register",
    method: "POST",
    body: data,
  });
}

export async function login(data: any) {
  return await request({ url: "/api/auth/login", method: "POST", body: data });
}
