import type { NextPage } from "next";
import { useState } from "react";
import { useUser } from "~/components/AuthContext";
import Head from "~/components/Head";
import Main from "~/components/Main";
import LeftBar from "~/components/main/LeftBar";
import RightBar from "~/components/RightBar";
import { withSession } from "~/server/withSession";

export const getServerSideProps = withSession({ force: true });

const Home: NextPage = () => {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Head title="Twitter Clone" description="Twitter Clone made in nextjs" />
      {user !== null && (
        <div className="flex min-h-screen justify-center">
          <LeftBar isOpen={isOpen} setIsOpen={setIsOpen} />
          <Main setIsOpen={setIsOpen} />
          <RightBar />
        </div>
      )}
    </div>
  );
};

export default Home;
