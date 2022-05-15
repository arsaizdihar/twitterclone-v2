import axios from "axios";

export async function request({
  url,
  method,
  body,
}: {
  url: string;
  method?: string;
  body?: any;
}) {
  return await axios(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    data: body,
  }).then((res) => res.data);
}

export async function register(data: any) {
  return await request({ url: "/api/register", method: "POST", body: data });
}

export async function login(data: any) {
  return await request({ url: "/api/login", method: "POST", body: data });
}
