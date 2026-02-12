/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "n11asj8ry1.ufs.sh", // Your specific UploadThing host
        port: "",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "canva-clone-ali.vercel.app",
      },
    ],
  },
};

export default nextConfig;
