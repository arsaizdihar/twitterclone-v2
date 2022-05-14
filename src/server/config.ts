const token = {
  secret: process.env.TOKEN_SECRET || "thisissecret",
  expireTime: Number(process.env.TOKEN_EXPIRE) || 3600 * 24 * 30,
  issuer: process.env.TOKEN_ISSUER || "default issuer",
};

const origin = (process.env.ORIGIN || "http://localhost").split(" ");

const config = {
  token,
  origin,
  DEV: process.env.NODE_ENV !== "production",
};
export default config;
