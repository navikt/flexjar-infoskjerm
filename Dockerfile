FROM gcr.io/distroless/nodejs20-debian12@sha256:f912a7599e5338df6527a669def29bddc9469fdac9ab22c4cc9282c1b64c868b

ENV NODE_ENV production

COPY /next.config.js ./
COPY /.next ./.next
COPY /node_modules ./node_modules
COPY /public ./public

ENV PORT=3000

CMD ["./node_modules/next/dist/bin/next", "start"]
