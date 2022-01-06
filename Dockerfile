# builder steps
FROM node:13.13-alpine AS builder
WORKDIR /app

# copy files to container
COPY ./package.json ./
#ENV NODE_ENV='production'
RUN yarn install
# run files
COPY . .
RUN yarn build

# non-local env steps
FROM node:13.13-alpine
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
CMD ["yarn", "run", "start:prod"]
