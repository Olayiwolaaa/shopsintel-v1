// src/types.ts
export type VideoItem = {
  id: number;
  followerCount: number;
  pageUrl: string;
  videoGMV: number;
  videoId: number; // Ensure consistency across files
  mainImage: string;
  videoDescription: string;
  productImage: string;
  productDescription: string;
  creatorUsername: string;
  views: number;
  likes: number;
  comments: number;
};
