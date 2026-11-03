FROM gcr.io/distroless/nodejs24-debian13@sha256:03980f6fd2a3245fa06e371c36fd33528ebbc676a1d0f84e3e21d95cd291b807

WORKDIR /app

ENV NODE_ENV production

COPY /.next ./.next
COPY /node_modules ./node_modules
COPY /public ./public

ENV PORT=3000

CMD ["./node_modules/next/dist/bin/next", "start"]
