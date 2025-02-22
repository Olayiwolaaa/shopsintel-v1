"use client";

import { useEffect, useState } from "react";
import {
  ClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import VideoGrid from "@/components/VideoGrid";
import Pagination from "@/components/Pagination";
import CountrySelector from "@/components/CountrySelector";
import SkeletonLoader from "@/components/SkeletonLoader";
import SortByDropdown from "@/components/SortByDropdown";
import { InputWithButton } from "@/components/InputWithButton";
import { PostHogProvider } from "./providers";
import { VideoItem } from "@/types";

// Function to get cache data from localStorage
const getCache = (cacheKey: string) => {
  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > 5 * 60 * 1000) return null; // Expire after 5 minutes

  return data;
};

// Function to set cache in localStorage
const setCache = (cacheKey: string, data: any) => {
  localStorage.setItem(
    cacheKey,
    JSON.stringify({ data, timestamp: Date.now() })
  );
};

export default function Home() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);

      const queryParams = new URLSearchParams({
        country: selectedCountry,
        page: currentPage.toString(),
        filter_by: sortBy,
      });

      if (searchQuery) {
        queryParams.append("search_query", searchQuery);
      }

      const cacheKey = `${selectedCountry}_${currentPage}_${sortBy}_${searchQuery}`;
      const cachedData = getCache(cacheKey);

      if (cachedData) {
        console.log("Using cached data for:", cacheKey);
        setVideos(cachedData);
        setLoading(false);
        return;
      }

      const apiUrl = `https://shopsintel-backend.onrender.com/find_creators?${queryParams.toString()}`;
      console.log("Fetching from API:", apiUrl);

      try {
        const response = await fetch(apiUrl, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data?.creator_profile_list?.length > 0) {
          const parsedVideos: VideoItem[] = data.creator_profile_list
            .map((creator: any, index: number): VideoItem | null => {
              const topVideoData = creator?.top_video_data?.value?.[0];

              if (!topVideoData || !topVideoData.video_products?.length)
                return null;

              return {
                id: index + 1,
                followerCount: creator?.follower_cnt?.value || 0,
                pageUrl: `https://tiktok.com/@${
                  creator?.handle?.value || "unknown"
                }`,
                videoGMV: creator?.video_gmv?.value?.value || 0,
                videoId: topVideoData?.item_id || 0, // Ensure string type
                mainImage:
                  topVideoData?.video?.post_url || "/default-image.jpg",
                videoDescription:
                  topVideoData?.name || "No description available",
                productImage:
                  topVideoData?.video_products?.[0]?.image ||
                  "/default-image.jpg",
                productDescription:
                  topVideoData?.video_products?.[0]?.name ||
                  "No description available",
                creatorUsername: creator?.handle?.value || "Unknown",
                views: topVideoData?.play_cnt || 0,
                likes: topVideoData?.like_cnt || 0,
                comments: topVideoData?.comment_cnt || 0,
              };
            })
            .filter(
              (video: VideoItem | null): video is VideoItem => video !== null
            );

          // Save to localStorage cache
          setCache(cacheKey, parsedVideos);

          setVideos(parsedVideos);
        } else {
          console.warn("No creators found.");
          setVideos([]);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]); // Ensure state is always updated
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [currentPage, selectedCountry, sortBy, searchQuery]);

  // Handle search submission
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <ClerkProvider>
      <PostHogProvider>
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="flex flex-col items-center justify-center pb-8">
            <SignedIn>
              <UserButton showName />
            </SignedIn>
          </header>
          <h1 className="text-3xl font-bold mb-8 text-center text-primary">
            🚀 GENZSEARCH
          </h1>

          <div className="flex flex-col items-center gap-4 mb-4">
            <CountrySelector
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
            <SortByDropdown value={sortBy} onChange={setSortBy} />

            {/* Search Bar */}
            <InputWithButton onSearch={handleSearch} />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={currentPage + 9}
            onPageChange={setCurrentPage}
          />

          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              <SignedOut>
                {currentPage >= 2 ? (
                  <div className="flex justify-center items-center">
                    <SignIn routing="hash" />
                  </div>
                ) : (
                  <VideoGrid items={videos} />
                )}
              </SignedOut>

              <SignedIn>
                <VideoGrid items={videos} />
              </SignedIn>
            </>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={currentPage + 9}
            onPageChange={setCurrentPage}
          />
        </main>
      </PostHogProvider>
    </ClerkProvider>
  );
}
