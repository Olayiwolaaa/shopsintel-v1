import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "p16-oec-va.ibyteimg.com",
      },
      {
        protocol: "https",
        hostname: "p19-vod-sign-useast2a.tiktokcdn-eu.com",
      },
      {
        protocol: "https",
        hostname: "p16-vod-sign-useast2a.tiktokcdn-eu.com",
      },
      {
        protocol: "https",
        hostname: "p16-oec-eu-common-useast2a.ibyteimg.com",
      },
      {
        protocol: "https",
        hostname: "p19-oec-eu-common-useast2a.ibyteimg.com",
      },
      {
        protocol: "https",
        hostname: "p16-oec-common-useast2a.ibyteimg.com",
      },
      {
        protocol: "https",
        hostname: "p19-oec-va.ibyteimg.com",
      },
      {
        protocol: "https",
        hostname: "p16-sign.tiktokcdn-us.com",
      },
      {
        protocol: "https",
        hostname: "p16-tiktokcdn-com.akamaized.net",
      },
      {
        protocol: "https",
        hostname: "p16-sign-va.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "p16-oec-ttp.tiktokcdn-us.com",
      },
      {
        protocol: "https",
        hostname: "p19-oec-ttp.tiktokcdn-us.com",
      },
      {
        protocol: "https",
        hostname: "p16-sign-sg.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "p16-oec-sg.ibyteimg.com",
      },
    ],
  },
};

export default nextConfig;


