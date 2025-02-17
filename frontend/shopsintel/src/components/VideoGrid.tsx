import Image from "next/image";
import { Eye, ThumbsUp, MessageCircle } from "lucide-react";

type VideoItem = {
  id: number;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-card rounded-lg shadow-md overflow-hidden border border-gray-700"
        >
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={`${item.mainImage}?cropcenter-q:300:400:q72`}
              alt={item.videoDescription}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
            />
          </div>
          <div className="p-4">
            <p className="text-sm mb-3 text-card-foreground line-clamp-2">
              {item.videoDescription}
            </p>
            <div className="flex items-center mb-3">
              <div className="relative w-16 h-16 mr-3">
                <Image
                  src={item.productImage || "/img.jpeg"}
                  alt={item.productDescription}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.productDescription}
                </p>
                <p className="text-xs text-accent-foreground mt-1">
                  @{item.creatorUsername}
                </p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center">
                <Eye size={14} className="mr-1" />
                {formatNumber(item.views)}
              </span>
              <span className="flex items-center">
                <ThumbsUp size={14} className="mr-1" />
                {formatNumber(item.likes)}
              </span>
              <span className="flex items-center">
                <MessageCircle size={14} className="mr-1" />
                {formatNumber(item.comments)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
