import axios from "axios";

export default async function request({
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
