/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        // Will only be available on the server side
        flexjarBackendClientId: process.env.FLEXJAR_BACKEND_CLIENT_ID,
    },
}

module.exports = nextConfig
