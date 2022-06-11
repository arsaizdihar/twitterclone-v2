/* eslint-disable @next/next/no-img-element */
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { InfiniteData } from "react-query";
import { ITweet } from "~/type";
import { deleteTweet, likeTweet } from "~/utils/api/tweet";
import { getTweetTimeString } from "~/utils/getTweetTimeString";
import queryClient from "~/utils/queryClient";
import { useUser } from "../AuthContext";
import { Private, ThreeDots, Verified } from "../icons";
import Modal from "../Modal";
import ProfilePic from "../profile/ProfilePic";

function updateQueryWrapper(tweet: any) {
  return (
    oldData:
      | InfiniteData<{
          tweets: ITweet[];
          count: number;
        }>
      | undefined
  ) => {
    if (!oldData) {
      return {
        pages: [{ tweets: [tweet], count: 1 }],
        pageParams: [undefined],
      };
    }
    oldData.pages.forEach((page) => {
      let found = false;
      page.tweets.forEach((t) => {
        if (t.id === tweet.id) {
          t.isLiked = !t.isLiked;
          t._count.likes += t.isLiked ? 1 : -1;
          found = true;
          return;
        }
      });
      if (found) return;
    });
    return oldData;
  };
}

const Tweet: React.FC<{
  tweet: ITweet;
}> = ({ tweet }) => {
  const user = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const modalRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (showMenu) modalRef.current?.focus();
  }, [showMenu]);
  const handleLike = () => {
    likeTweet(tweet.id).then(() => {
      const updateQuery = updateQueryWrapper(tweet);
      if (queryClient.getQueryState("tweets")) {
        queryClient.setQueryData("tweets", updateQuery);
      }
      if (queryClient.getQueryState(["profileTweets", tweet.user.username])) {
        queryClient.setQueryData(
          ["profileTweets", tweet.user.username],
          updateQuery
        );
      }
      if (router.pathname === "/[username]/status/[tweetId]") {
        router.replace(window.location.href);
      }
    });
  };

  const handleDelete = () => {
    const promise = deleteTweet(tweet.id).then(() => {
      setIsDelete(false);
      queryClient.invalidateQueries("tweets");
      queryClient.invalidateQueries(["profileTweets", user?.username]);
    });

    toast.promise(promise, {
      loading: "Deleting tweet...",
      success: "Tweet deleted!",
      error: "Failed to delete tweet!",
    });

    promise.catch((err) => console.log(err));
  };
  const sender = tweet.user;
  return (
    <div className="bg-white dark:bg-black dark:text-gray-200 flex px-2 sm:px-4 py-4 hover:bg-gray-100 dark:hover:bg-neutral-900 cursor-pointer main-border">
      <Modal
        title="Delete tweet?"
        onClose={() => setIsDelete(false)}
        open={isDelete}
        small
        titleLeft
      >
        <p className="text-sm text-gray-500 mt-2 mb-4">
          This can&apos;t be undone and it will be removed from your profile,
          the timeline of any accounts that follow you, and from Twitter search
          results.
        </p>
        <button
          className="block bg-red-600 w-full p-2 font-bold rounded-full my-2 hover:bg-red-700 duration-200 text-white"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="block bg-white dark:bg-black border-2 dark:border-gray-700 w-full p-2 font-bold rounded-full my-2 hover:bg-gray-200 dark:hover:bg-neutral-900 duration-200"
          onClick={() => setIsDelete(false)}
        >
          Cancel
        </button>
      </Modal>
      <div className="mr-2 w-12 flex-shrink-0">
        <ProfilePic
          src={sender.photoUrl}
          username={sender.username}
        ></ProfilePic>
      </div>
      <div className="flex flex-col flex-grow px-2">
        <div className="flex items-center max-w-full flex-wrap relative">
          <Link href={`/${sender.username}`}>
            <a className="font-bold hover:underline">{sender.displayName}</a>
          </Link>
          {sender.private && <Private />}
          {sender.verified && <Verified />}
          <span className="sm:pl-2 text-neutral-500 block w-full sm:inline-block sm:w-auto">
            @{sender.username} · {getTweetTimeString(tweet.createdAt)}
          </span>
          <div className="absolute sm:static top-0 right-0 sm:flex flex-grow justify-end">
            <div className="relative">
              <button className="" onClick={() => setShowMenu(true)}>
                <ThreeDots />
              </button>
              {showMenu && sender.username === user?.username && (
                <div
                  className="absolute right-8 top-0 bg-white dark:bg-black dark:border dark:border-gray-700 shadow-md rounded-md"
                  onBlur={() => setShowMenu(false)}
                >
                  <button
                    ref={modalRef}
                    className="p-2 text-red-500 flex items-center hover:bg-gray-100 dark:hover:bg-neutral-800"
                    onClick={() => setIsDelete(true)}
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="w-4 inline-block mr-2"
                    />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Link href={`/${sender.username}/status/${tweet.id}`} passHref>
          <p className="break-words sm:max-w-full">{tweet.text}</p>
        </Link>
        <div className="flex flex-wrap">
          {tweet.media.map((file) => (
            <Link href={file.url} key={file.id}>
              <a target="_blank" className="h-40 text-left">
                <img
                  src={file.url}
                  alt={file.id}
                  loading="lazy"
                  className="object-contain max-h-full"
                />
              </a>
            </Link>
          ))}
        </div>

        <div className="flex justify-between mt-2 text-neutral-500">
          <Link href={`/${tweet.user.username}/status/${tweet.id}`}>
            <a className="flex items-center hover:text-blue-500 group">
              <div className="rounded-full h-8 w-8 group-hover:bg-blue-100 dark:group-hover:bg-blue-500 dark:group-hover:bg-opacity-20 dark:group-hover:bg-transparent flex justify-center items-center cursor-pointer">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <g>
                    <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                  </g>
                </svg>
              </div>
              {tweet._count.comments > 0 && tweet._count.comments}
            </a>
          </Link>
          <div className="flex items-center hover:text-green-400 group">
            <div className="rounded-full h-8 w-8 group-hover:bg-green-100 dark:group-hover:bg-green-500 dark:group-hover:bg-opacity-20 flex justify-center items-center cursor-pointer">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
              >
                <g>
                  <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
                </g>
              </svg>
            </div>
            {tweet._count.retweets > 0 && tweet._count.retweets}
          </div>
          <div
            className={classNames(
              `flex relative items-center hover:text-pink-600 group`,
              tweet.isLiked && "text-pink-600"
            )}
            onClick={handleLike}
          >
            <div className="rounded-full h-8 w-8 group-hover:bg-red-100 dark:group-hover:bg-red-500 dark:group-hover:bg-opacity-20 flex justify-center items-center cursor-pointer">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
              >
                <g>
                  {tweet.isLiked ? (
                    <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path>
                  ) : (
                    <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
                  )}
                </g>
              </svg>
            </div>
            {tweet._count.likes > 0 && (
              <span className="absolute left-8 text-sm">
                {tweet._count.likes}
              </span>
            )}
          </div>
          <div className="flex items-center hover:text-blue-500 group">
            <div className="rounded-full h-8 w-8 group-hover:bg-blue-100 dark:group-hover:bg-blue-500 dark:group-hover:bg-opacity-20 flex justify-center items-center cursor-pointer">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
              >
                <g>
                  <path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></path>
                  <path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
