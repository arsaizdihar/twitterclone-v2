import { removeCookies } from "cookies-next";
import { GetServerSideProps } from "next";
import React from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  removeCookies("token", ctx);
  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
};

function Logout() {
  return <></>;
}

export default Logout;
