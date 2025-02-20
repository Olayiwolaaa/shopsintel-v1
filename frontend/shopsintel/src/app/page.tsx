"use client";

import { useEffect, useState } from "react";
import VideoGrid from "@/components/VideoGrid";
import Pagination from "@/components/Pagination";
import CountrySelector from "@/components/CountrySelector";
import SkeletonLoader from "@/components/SkeletonLoader";
import SortByDropdown from "@/components/SortByDropdown";
import { InputWithButton } from "@/components/InputWithButton"; // Import search input

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("GB");
  const [sortBy, setSortBy] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          country: selectedCountry,
          page: currentPage.toString(),
          filter_by: sortBy,
        });

        if (searchQuery) {
          queryParams.append("search_query", searchQuery);
        }

        const apiUrl = `http://127.0.0.1:8000/find_creators?${queryParams.toString()}`;
        console.log(`Fetching: ${apiUrl}`);

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data?.creator_profile_list?.length > 0) {
          setVideos(
            data.creator_profile_list
              .map((creator: any, index: number) => {
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
                  videoId: topVideoData?.item_id || "unknown",
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
              .filter(Boolean)
          );
        } else {
          console.warn("No creators found.");
          setVideos([]);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [currentPage, selectedCountry, sortBy, searchQuery]);

  // 🔹 Handle search submission
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        ⚡️ SHOPSINTEL
      </h1>

      <div className="flex flex-col items-center gap-4 mb-4">
        <CountrySelector
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
        <SortByDropdown value={sortBy} onChange={setSortBy} />

        {/* 🔹 Search Bar */}
        <InputWithButton onSearch={handleSearch} />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={currentPage + 9}
        onPageChange={setCurrentPage}
      />

      {loading ? <SkeletonLoader /> : <VideoGrid items={videos} />}

      <Pagination
        currentPage={currentPage}
        totalPages={currentPage + 9}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
