import axios from "axios";

export default async function request({
  url,
  method,
  body,
  type = "json",
}: {
  url: string;
  method?: string;
  body?: any;
  type?: "json" | "form";
}) {
  return await axios(url, {
    method,
    headers: {
      "Content-Type":
        type === "json" ? "application/json" : "multipart/form-data",
    },
    withCredentials: true,
    data: body,
  }).then((res) => res.data);
}
