import { Tweet, User } from "@prisma/client";

export interface ISimpleUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  private: boolean;
  verified: boolean;
  photoUrl: string | null;
}

export type ITweet = Tweet & {
  user: ISimpleUser;
  createdAt: string;
  isLiked: boolean;
  _count: {
    comments: number;
    likes: number;
    retweets: number;
  };
};

export type IUserProfile = User & {
  followers: { id: string }[];
  _count: {
    followers: number;
    following: number;
    tweets: number;
  };
  createdAt: string;
  updatedAt: string;
};
