import Image from "next/image";
import { DollarSign, Eye, Heart, MessageCircle, UserRoundCheck } from "lucide-react";

type VideoItem = {
  id: number;
  followerCount: number;
  pageUrl: string;
  videoGMV: number;
  videoId: number;
  mainImage: string;
  videoDescription: string;
  productImage: string;
  productDescription: string;
  creatorUsername: string;
  views: number;
  likes: number;
  comments: number;
};

type VideoGridProps = {
  items: VideoItem[];
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

export default function VideoGrid({ items }: VideoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-card rounded-lg shadow-md overflow-hidden border border-gray-700"
        >
          <div className="relative aspect-[3/4] w-full">
            <a
              href={`${item.pageUrl}/video/${item.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={item.mainImage || "/img.jpeg"}
                alt={item.videoDescription}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
              />
            </a>
          </div>
          <div className="p-4">
            <p className="text-sm mb-3 text-card-foreground line-clamp-2">
              {item.videoDescription}
            </p>
            <div className="flex items-start mb-3">
              <div className="relative w-16 h-16 mr-3 flex-shrink-0">
                <Image
                  src={item.productImage || "/img.jpeg"}
                  alt={item.productDescription || "Product image"}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                  {item.productDescription}
                </p>
                <p className="text-xs text-accent-foreground truncate">
                  <a
                    href={`${item.pageUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{item.creatorUsername}
                  </a>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
              <DollarSign size={14} />
              {formatNumber(item.videoGMV)}
              </span>
              <span className="flex items-center gap-1">
              <Eye size={14} />
              {formatNumber(item.views)}
              </span>
              <span className="flex items-center gap-1">
              <Heart size={14} />
              {formatNumber(item.likes)}
              </span>
              <span className="flex items-center gap-1">
              <MessageCircle size={14} />
              {formatNumber(item.comments)}
              </span>
              <span className="flex items-center gap-1">
              <UserRoundCheck size={14} />
              {formatNumber(item.followerCount)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
