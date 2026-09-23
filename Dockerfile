FROM gcr.io/distroless/nodejs24-debian13@sha256:b1fc33242cc74151f50c62b4a03d48afd759dccf81279b5f8e401db4546479c1

WORKDIR /app

ENV NODE_ENV production

COPY /.next ./.next
COPY /node_modules ./node_modules
COPY /public ./public

ENV PORT=3000

CMD ["./node_modules/next/dist/bin/next", "start"]
