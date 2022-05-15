import BasicLayout from "~/components/BasicLayout";
import Head from "~/components/Head";
import Main from "~/components/Main";
import { withSession } from "~/server/withSession";

export const getServerSideProps = withSession({ force: true });

const Home = () => {
  return (
    <>
      <Head title="Twitter Clone" description="Twitter Clone made in nextjs" />
      <Main />
    </>
  );
};
Home.Layout = BasicLayout;
export default Home;
