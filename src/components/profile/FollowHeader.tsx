import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
interface Props {
  user: any;
}
const FollowHeader: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const isFollowers = router.asPath.endsWith("followers");
  const isFollowing = router.asPath.endsWith("following");
  return (
    <>
      <div className="flex p-2 items-center main-border">
        <a
          className="text-blue-500 dark:text-white hover:bg-blue-100 dark:hover:bg-neutral-900 h-10 w-10 flex items-center justify-center rounded-full cursor-pointer"
          onClick={() => router.back()}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
          >
            <g>
              <path d="M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z"></path>
            </g>
          </svg>
        </a>
        <h1 className="mx-2 font-bold">{user.displayName}</h1>
      </div>
      <div className="flex justify-evenly font-bold text-gray-700 dark:text-neutral-500 text-xs sm:text-base main-border">
        <div className="flex-grow flex justify-center hover:bg-blue-100 dark:hover:bg-neutral-900 hover:text-blue-500 cursor-pointer">
          <div className="py-3">Followers you know</div>
        </div>
        <Link href={`/${user.username}/followers`}>
          <a
            className={`flex-grow flex justify-center hover:bg-blue-100 dark:hover:bg-neutral-900 cursor-pointer ${
              isFollowers
                ? "text-blue-500 dark:text-gray-200"
                : "hover:text-blue-500 dark:hover:text-current"
            }`}
          >
            <div
              className={`py-3 ${isFollowers && "border-b-4 border-blue-500"}`}
            >
              Followers
            </div>
          </a>
        </Link>
        <Link href={`/${user?.username}/following`}>
          <a
            className={`flex-grow flex justify-center hover:bg-blue-100 dark:hover:bg-neutral-900 cursor-pointer ${
              isFollowing
                ? "text-blue-500 dark:text-gray-200"
                : "hover:text-blue-500 dark:hover:text-current"
            }`}
          >
            <div
              className={`py-3 ${isFollowing && "border-b-4 border-blue-500"}`}
            >
              Following
            </div>
          </a>
        </Link>
      </div>
    </>
  );
};

export default FollowHeader;
