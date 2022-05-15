import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IUserProfile } from "~/type";
import { Private, Verified } from "../icons";

interface Props {
  isCurrentUser: boolean;
  user: IUserProfile;
  username: string;
}

const Profile: React.FC<Props> = ({ isCurrentUser, user, username }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const hasNextCallback = (num: number, next: boolean) => {
    if (num == page) {
      setHasNext(next);
    }
  };
  const followCallback = () => {
    // if (user.pk) {
    //   follow({ variables: { userId: user.pk } });
    // }
  };
  return (
    <div className="dark:bg-black max-w-[600px] flex-grow min-h-screen dark:text-gray-200">
      <div className="dark:bg-black flex p-2 items-center main-border">
        <Link href="/">
          <a className="text-blue-500 dark:text-white hover:bg-blue-100 dark:hover:bg-neutral-900 h-10 w-10 flex items-center justify-center rounded-full cursor-pointer">
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
        </Link>
        <h1 className="ml-2 font-bold">{user.displayName}</h1>
        {user.private && <Private />}
        {user.verified && <Verified />}
      </div>
      <div className="h-48 bg-yellow-700 w-full main-border-x"></div>
      <div className="px-4 dark:bg-black py-2 main-border-x">
        <div className="relative">
          <div className="absolute bottom-0 right-0 left-0 bg-white dark:bg-transparent h-32 w-32 rounded-full border-4 border-white dark:border-black">
            <Image
              src={user.photoUrl || "/img/profile.jpeg"}
              alt="profile"
              layout="fill"
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex justify-end">
            {/* {isCurrentUser ? (
              <EditProfile />
            ) : (
              !isServer() && (
                <FollowButton
                  isFollowed={user.isFollowed}
                  followCallback={followCallback}
                  isRequested={user.isRequested}
                />
              )
            )} */}
          </div>
        </div>
        <div className="leading-tight">
          <div className="py-2">
            <h2 className="font-bold text-lg flex items-center">
              {user.displayName} {user.private && <Private />}
              {user.verified && <Verified />}
            </h2>
            <h3 className="text-sm text-gray-600 dark:text-neutral-500">
              @{user.username}
            </h3>
          </div>
        </div>
        <div className="leading-tight">
          <p className="">{user.bio}</p>
          <a className="text-xs text-blue-500 cursor-pointer hover:underline">
            Translate bio
          </a>
        </div>
        <div className="flex py-2 space-x-4">
          <Link href={`${router.asPath}/following`}>
            <a className="cursor-pointer hover:underline">
              <span className="text-lg font-bold">{user._count.following}</span>{" "}
              <span className="dark:text-neutral-500">Following</span>
            </a>
          </Link>
          <Link href={`${router.asPath}/followers`}>
            <a className="cursor-pointer hover:underline">
              <span className="text-lg font-bold">{user._count.followers}</span>{" "}
              <span className="dark:text-neutral-500">Followers</span>
            </a>
          </Link>
        </div>
      </div>
      <div className="flex justify-evenly dark:bg-black font-bold text-gray-700 dark:text-neutral-500 main-border-x">
        <div className="flex-grow flex justify-center hover:bg-blue-100 dark:hover:bg-neutral-900 text-blue-500 cursor-pointer">
          <div className="py-3 border-b-4 border-blue-500">Tweets</div>
        </div>
        <div className="flex-grow flex justify-center hover:bg-blue-100 dark:hover:bg-neutral-900 hover:text-blue-500 dark:hover:text-current cursor-pointer">
          <div className="py-3">Tweets & replies</div>
        </div>
        <div className="flex-grow flex justify-center hover:bg-blue-100 dark:hover:bg-neutral-900 hover:text-blue-500 dark:hover:text-current cursor-pointer">
          <div className="py-3">Media</div>
        </div>
        <div className="flex-grow flex justify-center hover:bg-blue-100 dark:hover:bg-neutral-900 hover:text-blue-500 dark:hover:text-current cursor-pointer">
          <div className="py-3">Likes</div>
        </div>
      </div>
      <div>
        {/* <InfiniteScroll
          dataLength={page} //This is important field to render the next data
          next={() => setPage(page + 1)}
          hasMore={hasNext}
          loader={<h4 className="text-center my-2">Loading...</h4>}
        >
          {Array(page)
            .fill(0)
            .map((val, index) => (
              <TweetPages
                page={index + 1}
                key={index}
                hasNextCallback={hasNextCallback}
                username={username}
              />
            ))}
        </InfiniteScroll> */}
      </div>
    </div>
  );
};

export default Profile;
