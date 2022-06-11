/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { InfiniteData } from "react-query";
import { ITweet } from "~/type";
import { postTweet } from "~/utils/api/tweet";
import queryClient from "~/utils/queryClient";
import { useUser } from "../AuthContext";
import ProfilePic from "../profile/ProfilePic";

function updateQueryWrapper(data: any) {
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
        pages: [{ tweets: [data], count: 1 }],
        pageParams: [undefined],
      };
    }
    oldData.pages[0].tweets.unshift(data);
    oldData.pages[oldData.pages.length - 1].count++;
    return oldData;
  };
}

const TweetInput: React.FC<{ resetPage: () => void }> = ({ resetPage }) => {
  const user = useUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tweetInput, setTweetInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const imageInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // autosize(textareaRef.current!);
  }, []);

  const handleTweetSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    if ((tweetInput.length > 0 || images.length > 0) && user) {
      resetPage();
      const formData = new FormData();

      formData.append("text", tweetInput);
      images.forEach((image) => formData.append("files", image));
      const promise = postTweet(formData).then((data) => {
        const updateQuery = updateQueryWrapper(data);
        setTweetInput("");
        setImages([]);
        queryClient.setQueryData<
          InfiniteData<{
            tweets: ITweet[];
            count: number;
          }>
        >("tweets", updateQuery);
        if (queryClient.getQueryState(["profileTweets", user.username]))
          queryClient.setQueryData(
            ["profileTweets", user.username],
            updateQuery
          );
      });

      toast.promise(promise, {
        loading: "Posting tweet...",
        success: "Tweet posted!",
        error: "Failed to post tweet!",
      });
      promise.catch((err) => console.log(err));
    }
  };
  return (
    <div className="bg-white dark:bg-black flex px-4 py-2 main-border">
      <div className="mr-2 flex-shrink-0">
        <ProfilePic src={user?.photoUrl} username={user?.username}></ProfilePic>
      </div>
      <div className="flex flex-grow flex-col">
        <form onSubmit={handleTweetSubmit}>
          <div className="py-2" onSubmit={handleTweetSubmit}>
            <textarea
              ref={textareaRef}
              className="outline-none text-xl resize-none w-full dark:bg-black dark:text-white"
              placeholder="What's happening?"
              value={tweetInput}
              onChange={(e) => setTweetInput(e.target.value)}
            ></textarea>
            <div className="flex">
              {images.map((image, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(image)}
                  alt={"image"}
                  className="h-40 object-contain"
                ></img>
              ))}
            </div>
          </div>
          <div>
            <div className="text-blue-500 hover:bg-blue-100 dark:hover:bg-neutral-800 inline pt-1 pb-2 px-4 rounded-full cursor-pointer select-none">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 inline mr-2"
                fill="currentColor"
              >
                <g>
                  <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zM9.047 5.9c-.878.484-1.22.574-1.486.858-.263.284-.663 1.597-.84 1.712-.177.115-1.462.154-1.462.154s2.148 1.674 2.853 1.832c.706.158 2.43-.21 2.77-.142.342.07 2.116 1.67 2.324 2.074.208.404.166 1.748-.038 1.944-.204.196-1.183 1.09-1.393 1.39-.21.3-1.894 4.078-2.094 4.08-.2 0-.62-.564-.73-.848-.11-.284-.427-4.012-.59-4.263-.163-.25-1.126-.82-1.276-1.026-.15-.207-.552-1.387-.527-1.617.024-.23.492-1.007.374-1.214-.117-.207-2.207-1.033-2.61-1.18-.403-.145-.983-.332-.983-.332 1.13-3.652 4.515-6.318 8.52-6.38 0 0 .125-.018.186.14.11.286.256 1.078.092 1.345-.143.23-2.21.99-3.088 1.474zm11.144 8.24c-.21-.383-1.222-2.35-1.593-2.684-.23-.208-2.2-.912-2.55-1.09-.352-.177-1.258-.997-1.267-1.213-.01-.216 1.115-1.204 1.15-1.524.056-.49-1.882-1.835-1.897-2.054-.015-.22.147-.66.31-.81.403-.36 3.19.04 3.556.36 2 1.757 3.168 4.126 3.168 6.873 0 .776-.18 1.912-.282 2.18-.08.21-.443.232-.595-.04z"></path>
                </g>
              </svg>
              <span className="font-bold text-sm">Everyone can reply</span>
            </div>
          </div>
          <hr className="my-4 dark:border-gray-600" />
          <div className="flex">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={imageInput}
              multiple
              onChange={(e) => {
                e.preventDefault();
                let files = e.target.files;
                if (files) {
                  setImages(Array.from(files));
                } else {
                  setImages([]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => imageInput.current?.click()}
              className="text-blue-500 rounded-full h-10 w-10 hover:bg-blue-100 dark:hover:bg-neutral-800 flex justify-center items-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            <div className="text-blue-500 rounded-full h-10 w-10 hover:bg-blue-100 dark:hover:bg-neutral-800 flex justify-center items-center cursor-pointer">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6"
                fill="currentColor"
              >
                <g>
                  <path d="M19 10.5V8.8h-4.4v6.4h1.7v-2h2v-1.7h-2v-1H19zm-7.3-1.7h1.7v6.4h-1.7V8.8zm-3.6 1.6c.4 0 .9.2 1.2.5l1.2-1C9.9 9.2 9 8.8 8.1 8.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1 0 1.8-.4 2.4-1.1v-2.5H7.7v1.2h1.2v.6c-.2.1-.5.2-.8.2-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.6 1.6-1.6z"></path>
                  <path d="M20.5 2.02h-17c-1.24 0-2.25 1.007-2.25 2.247v15.507c0 1.238 1.01 2.246 2.25 2.246h17c1.24 0 2.25-1.008 2.25-2.246V4.267c0-1.24-1.01-2.247-2.25-2.247zm.75 17.754c0 .41-.336.746-.75.746h-17c-.414 0-.75-.336-.75-.746V4.267c0-.412.336-.747.75-.747h17c.414 0 .75.335.75.747v15.507z"></path>
                </g>
              </svg>
            </div>
            <div className="text-blue-500 rounded-full h-10 w-10 hover:bg-blue-100 dark:hover:bg-neutral-800 flex justify-center items-center cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-grow flex justify-end items-center">
              {tweetInput !== "" && (
                <div className="text-blue-500 rounded-full h-8 w-8 hover:bg-blue-100 dark:hover:bg-neutral-800 flex justify-center items-center cursor-pointer mr-2 border border-blue-500">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <g>
                      <path d="M19.75 11H13V4.25c0-.553-.447-1-1-1s-1 .447-1 1V11H4.25c-.553 0-1 .447-1 1s.447 1 1 1H11v6.75c0 .553.447 1 1 1s1-.447 1-1V13h6.75c.553 0 1-.447 1-1s-.447-1-1-1z"></path>
                    </g>
                  </svg>
                </div>
              )}
              <button
                type="submit"
                className={`rounded-full px-4 py-2 text-white font-bold ${
                  tweetInput || images.length > 0
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-blue-300 dark:bg-blue-500 dark:bg-opacity-60 dark:text-gray-400"
                }`}
                disabled={tweetInput === "" && images.length === 0}
              >
                Tweet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TweetInput;
