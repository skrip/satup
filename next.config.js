/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    //MONGODB_URI: "mongodb://localhost:27017",
    HOSTNAME: "localhost",
    PORT: 3000,
  }
}

module.exports = nextConfig
