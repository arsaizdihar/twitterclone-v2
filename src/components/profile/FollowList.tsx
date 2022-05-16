import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { follow } from "~/utils/api/user";
import queryClient from "~/utils/queryClient";
import { Private, Verified } from "../icons";
import ProfilePic from "./ProfilePic";

interface Props {
  followLists: any[];
}

export const FollowButton: React.FC<{
  isSelf?: boolean;
  isFollowed?: boolean;
  isRequested?: boolean;
  followCallback: () => void;
}> = ({ isSelf, isFollowed, followCallback, isRequested }) => {
  const [isHover, setIsHover] = useState(false);
  if (isSelf) return null;
  return (
    <button
      className={`font-semibold rounded-full px-4 border border-blue-500 ${
        isFollowed
          ? "bg-blue-500 dark:bg-black text-white hover:bg-red-700 hover:border-red-700 dark:hover:border-red-700 dark:border-neutral-600 dark:hover:text-red-700"
          : "text-blue-500 dark:text-black dark:hover:bg-opacity-80 dark:bg-white hover:bg-blue-100"
      }`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={followCallback}
    >
      {isFollowed
        ? isHover
          ? "Unfollow"
          : "Following"
        : isRequested
        ? "Cancel"
        : "Follow"}
    </button>
  );
};

const FollowList: React.FC<Props> = ({ followLists }) => {
  const router = useRouter();
  const username = router.query.username as string;
  const followCallback = (userId: string) => {
    follow(userId).then(() => {
      queryClient.invalidateQueries("whoToFollow");
      router.replace(router.asPath);
    });
  };
  return (
    <div className="w-full flex flex-col">
      {followLists.map((f) => (
        <div key={f.id} className="flex p-2 space-x-4 main-border">
          <div className="flex-shrink-0">
            <ProfilePic src={f.photoUrl} username={f.username} />
          </div>
          <div className="flex flex-grow flex-col">
            <div className="flex justify-between">
              <div className="leading-none">
                <div className="flex">
                  <Link href={`/user/${f.username}`}>
                    <a className="font-bold hover:underline">{f.displayName}</a>
                  </Link>
                  {f.private && <Private />}
                  {f.verified && <Verified />}
                </div>
                <span className="text-gray-600 dark:text-neutral-500">
                  @{f.username}
                </span>
              </div>
              {
                <FollowButton
                  isSelf={f.isSelf}
                  isFollowed={f.isFollowed}
                  isRequested={f.isRequested}
                  followCallback={() => followCallback(f.id)}
                />
              }
            </div>
            <p className="mt-1 text-gray-700">{f.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowList;
