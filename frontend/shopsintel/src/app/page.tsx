import VideoGrid from "@/components/VideoGrid";
import Pagination from "@/components/Pagination";

const dummyData = [
  {
    id: 1,
    mainImage: "/img.jpeg",
    videoDescription:
      "Exciting travel vlog in Paris: Eiffel Tower, Louvre, and hidden gems",
    productImage: "/img.jpeg",
    productDescription: "Compact travel backpack with multiple compartments",
    creatorUsername: "globetrotter",
    views: 1500000,
    likes: 75000,
    comments: 6200,
  },
  {
    id: 2,
    mainImage: "/img.jpeg",
    videoDescription:
      "Gourmet cooking tutorial: Perfect French cuisine at home",
    productImage: "/img.jpeg",
    productDescription: "Professional chef knife set",
    creatorUsername: "masterchef",
    views: 890000,
    likes: 42000,
    comments: 3100,
  },
  {
    id: 3,
    mainImage: "/img.jpeg",
    videoDescription:
      "Extreme sports compilation: Skydiving, surfing, and mountain biking",
    productImage: "/img.jpeg",
    productDescription: "Waterproof action camera",
    creatorUsername: "adrenaline_junkie",
    views: 2300000,
    likes: 180000,
    comments: 9500,
  },
  {
    id: 4,
    mainImage: "/img.jpeg",
    videoDescription:
      "DIY home renovation: Transform your living room on a budget",
    productImage: "/img.jpeg",
    productDescription: "Multifunctional power tool set",
    creatorUsername: "diy_expert",
    views: 670000,
    likes: 31000,
    comments: 2800,
  },
  {
    id: 5,
    mainImage: "/img.jpeg",
    videoDescription:
      "Mindfulness meditation guide for beginners: Find inner peace",
    productImage: "/img.jpeg",
    productDescription: "Ergonomic meditation cushion",
    creatorUsername: "zen_master",
    views: 420000,
    likes: 28000,
    comments: 1900,
  },
  {
    id: 6,
    mainImage: "/img.jpeg",
    videoDescription: "Tech review: Latest smartphones compared",
    productImage: "/img.jpeg",
    productDescription: "Universal phone stand and charger",
    creatorUsername: "tech_guru",
    views: 980000,
    likes: 52000,
    comments: 4100,
  },
  {
    id: 7,
    mainImage: "/img.jpeg",
    videoDescription: "Fitness challenge: 30-day full body workout plan",
    productImage: "/img.jpeg",
    productDescription: "Adjustable dumbbell set",
    creatorUsername: "fit_coach",
    views: 1200000,
    likes: 95000,
    comments: 7800,
  },
  {
    id: 8,
    mainImage: "/img.jpeg",
    videoDescription: "Art tutorial: Master watercolor painting techniques",
    productImage: "/img.jpeg",
    productDescription: "Professional watercolor paint set",
    creatorUsername: "artsy_creator",
    views: 350000,
    likes: 19000,
    comments: 1600,
  },
  {
    id: 9,
    mainImage: "/img.jpeg",
    videoDescription: "Gaming stream highlights: Epic wins and fails",
    productImage: "/img.jpeg",
    productDescription: "Ergonomic gaming chair",
    creatorUsername: "pro_gamer",
    views: 1800000,
    likes: 120000,
    comments: 8900,
  },
  {
    id: 10,
    mainImage: "/img.jpeg",
    videoDescription: "Language learning tips: Become fluent in 6 months",
    productImage: "/img.jpeg",
    productDescription: "Language learning app subscription",
    creatorUsername: "polyglot_pro",
    views: 560000,
    likes: 37000,
    comments: 3300,
  },
];

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        SHOPSINTEL
      </h1>
      <VideoGrid items={dummyData} />
      <Pagination currentPage={3} totalPages={10} />
    </main>
  );
}
