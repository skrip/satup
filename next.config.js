/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    //MONGODB_URI: "mongodb+srv://vercel-admin-user:lTSiFgl7S927VVl1@cluster0.8vvd8tj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    HOSTNAME: "localhost",
    PORT: 3000,
  }
}

module.exports = nextConfig
