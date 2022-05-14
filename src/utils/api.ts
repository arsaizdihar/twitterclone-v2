async function request({
  url,
  method,
  body,
}: {
  url: string;
  method?: string;
  body?: any;
}) {
  return await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  }).then((res) => res.json());
}

export async function register(data: any) {
  return await request({ url: "/api/register", method: "POST", body: data });
}

export async function login(data: any) {
  return await request({ url: "/api/login", method: "POST", body: data });
}
