import Link from "next/link";
import React from "react";
import { ISimpleUser } from "~/type";
import { Private, Verified } from "../icons";
import ProfilePic from "../profile/ProfilePic";

const WhoToFollows = () => {
  //   const [users, setUsers] = useState<User[]>([]);
  //   useEffect(() => {
  //     if (data?.unfollowed?.edges) {
  //       setUsers(data.unfollowed.edges.map((edge) => edge?.node) as User[]);
  //     }
  //   }, [data]);
  //   if (users.length === 0) return null;
  //   const followCallback = (userId?: number) => {
  //     if (userId) {
  //       follow({ variables: { userId } }).then((res) => {
  //         console.log(res);
  //         if (res.data?.follow?.success) {
  //           setUsers((users) => users.filter((user) => user.pk !== userId));
  //         }
  //       });
  //     }
  //   };
  return (
    <div className="bg-gray-100 dark:bg-gray_dark dark:text-gray-200 my-4 pt-2 rounded-xl">
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="font-extrabold text-xl">Who to follow</h3>
      </div>
      {/* {users.map((user) => (
        <WhoToFollow
          key={user.pk}
          user={user}
          followCallback={followCallback}
        />
      ))} */}
      <div className="hover:bg-gray-200 dark:hover:bg-trueGray-800 cursor-pointer text-blue-500 rounded-b-xl p-4">
        Show more
      </div>
    </div>
  );
};

const WhoToFollow: React.FC<{
  user: ISimpleUser;
  followCallback: (userId?: number) => void;
}> = ({ user, followCallback }) => {
  return (
    <div className="flex justify-between hover:bg-gray-200 dark:hover:bg-trueGray-800 px-4 cursor-pointer py-2 items-center">
      <div className="flex">
        <ProfilePic src={user.photoUrl} />
        <div className="leading-none ml-2">
          <Link href={`/user/${user.username}`} passHref>
            <h4 className="font-bold text-base hover:underline">
              {user.displayName} {user.private && <Private />}
              {user.verified && <Verified />}
            </h4>
          </Link>
          <span className="text-sm text-gray-600">@{user.username}</span>
        </div>
      </div>
      <button
        className="outline-none rounded-full px-4 py-1 border dark:bg-white border-blue-500 dark:border-black text-blue-500 dark:text-black hover:bg-blue-100 dark:hover:bg-gray-200 dark:font-semibold hover:bg-opacity-60"
        // onClick={() => followCallback(user.id)}
      >
        Follow
      </button>
    </div>
  );
};

export default WhoToFollows;
