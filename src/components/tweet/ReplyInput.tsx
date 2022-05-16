import Link from "next/link";
import React, { useRef, useState } from "react";
import { ISimpleUser } from "~/type";
import { postTweet } from "~/utils/api/tweet";
import queryClient from "~/utils/queryClient";
import { useUser } from "../AuthContext";
import ProfilePic from "../profile/ProfilePic";

const ReplyInput: React.FC<{ tweetUser: ISimpleUser; tweetId: string }> = ({
  tweetUser,
  tweetId,
}) => {
  const user = useUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tweetInput, setTweetInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const imageInput = useRef<HTMLInputElement>(null);
  const handleTweetSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (tweetInput.length > 0 && user) {
      const formData = new FormData();
      formData.append("text", tweetInput);
      formData.append("replyTo", tweetId);
      images.forEach((image) => formData.append("files", image));
      postTweet(formData).then((data) => {
        queryClient.setQueryData(["replies", tweetId], (oldData: any) => {
          if (!oldData) {
            return {
              pages: [{ tweets: [data], count: 1 }],
              pageParams: [undefined],
            };
          }
          oldData.pages[0].tweets.unshift(data);
          oldData.pages[oldData.pages.length - 1].count++;
          return oldData;
        });
        setTweetInput("");
        setImages([]);
      });
    }
  };
  return (
    <div className="bg-white dark:bg-black flex px-4 mx-1 py-2 mb-4">
      <div className="mr-2 flex-shrink-0 flex items-center">
        <ProfilePic
          src={user?.photoUrl || undefined}
          username={user?.username}
        ></ProfilePic>
      </div>
      <div className="flex flex-grow flex-col">
        <p className="text-gray-400 text-sm">
          Replying to{" "}
          <Link href={`/user/${tweetUser.username}`}>
            <a className="text-blue-500">@{tweetUser.username}</a>
          </Link>
        </p>
        <form onSubmit={handleTweetSubmit}>
          <div className="py-2" onSubmit={handleTweetSubmit}>
            <textarea
              ref={textareaRef}
              className="outline-none text-xl resize-none w-full dark:bg-black dark:text-white"
              placeholder="Tweet your reply"
              value={tweetInput}
              onChange={(e) => setTweetInput(e.target.value)}
            ></textarea>
            {images.map((image, idx) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={idx}
                src={URL.createObjectURL(image)}
                alt={image.name}
                className="h-40 object-contain"
              ></img>
            ))}
          </div>
          <hr className="my-4 dark:border-gray-600" />
          <div className="flex">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              ref={imageInput}
              onChange={(e) => {
                if (e.target.files) {
                  const images = [];
                  Array.from(e.target.files).forEach((image) => {
                    if (image.size < 5000000) {
                      images.push(image);
                    }
                  });
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
                  tweetInput
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-blue-300 dark:bg-blue-500 dark:bg-opacity-60 dark:text-gray-400"
                }`}
                disabled={tweetInput === ""}
              >
                Reply
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyInput;
