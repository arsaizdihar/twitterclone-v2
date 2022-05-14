import NextHead from "next/head";
import React from "react";
const Head: React.FC<{
  title?: string;
  description?: string;
  imageURL?: string;
}> = ({ title, description, imageURL }) => {
  return (
    <NextHead>
      <title>{title || "Twitter Clone"}</title>
      <meta
        name="description"
        content={description || "Twitter Clone made in nextjs"}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || "Twitter Clone"} />
      <meta
        name="twitter:description"
        content={description || "Twitter Clone made in nextjs"}
      />
      <meta
        name="twitter:image"
        content={imageURL || "https://abs.twimg.com/favicons/twitter.ico"}
      />
      <meta name="og:card" content="summary_large_image" />
      <meta name="og:title" content={title || "Twitter Clone"} />
      <meta
        name="og:description"
        content={description || "Twitter Clone made in nextjs"}
      />
      <meta
        name="og:image"
        content={imageURL || "https://abs.twimg.com/favicons/twitter.ico"}
      />
      <link rel="icon" href="/favicon.ico" />
    </NextHead>
  );
};

export default Head;
