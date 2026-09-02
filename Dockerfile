FROM gcr.io/distroless/nodejs24-debian13@sha256:7cca079bad19303c78cd874a5da79832441985a216b767196507d69b8784a698

WORKDIR /app

ENV NODE_ENV production

COPY /.next ./.next
COPY /node_modules ./node_modules
COPY /public ./public

ENV PORT=3000

CMD ["./node_modules/next/dist/bin/next", "start"]
