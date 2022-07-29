import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import React from "react";
import { useQuery } from "react-query";
import { ISimpleUser } from "~/type";
import { request } from "~/utils/api";
import { follow } from "~/utils/api/user";
import queryClient from "~/utils/queryClient";
import { Private, Verified } from "../icons";
import ProfilePic from "../profile/ProfilePic";

const WhoToFollows = () => {
  const { data: users } = useQuery<Array<ISimpleUser>>(
    "whoToFollow",
    () => request({ url: "/api/user/who-to-follow" }),
    {
      refetchOnMount: false,
    }
  );
  const [parent] = useAutoAnimate<HTMLDivElement>();
  if (!users || users.length === 0) return null;

  const followCallback = (userId: string) => {
    if (!users) return;
    follow(userId).then((data) => {
      queryClient.setQueryData(
        "whoToFollow",
        users.filter((user) => user.id !== userId)
      );
    });
  };
  return (
    <div className="bg-gray-100 dark:bg-gray_dark dark:text-gray-200 my-4 pt-2 rounded-xl">
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="font-extrabold text-xl">Who to follow</h3>
      </div>
      <div className="" ref={parent}>
        {users?.map((user) => (
          <WhoToFollow
            key={user.id}
            user={user}
            followCallback={followCallback}
          />
        ))}
      </div>
      <div className="hover:bg-gray-200 dark:hover:bg-neutral-800 cursor-pointer text-blue-500 rounded-b-xl p-4">
        Show more
      </div>
    </div>
  );
};

const WhoToFollow: React.FC<{
  user: ISimpleUser;
  followCallback: (userId: string) => void;
}> = ({ user, followCallback }) => {
  return (
    <div className="flex justify-between hover:bg-gray-200 dark:hover:bg-neutral-800 px-4 cursor-pointer py-2 items-center">
      <div className="flex">
        <ProfilePic src={user.photoUrl} />
        <div className="leading-none ml-2">
          <Link href={`/${user.username}`} passHref>
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
        onClick={() => followCallback(user.id)}
      >
        Follow
      </button>
    </div>
  );
};

export default WhoToFollows;
