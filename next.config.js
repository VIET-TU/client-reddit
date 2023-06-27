/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	env: {
		URL_SERVER: process.env.URL_SERVER,
		URL_SERVER_LOCAL: process.env.URL_SERVER_LOCAL,
	},
}

module.exports = nextConfig
