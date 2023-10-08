
# Build step
FROM node:14.14.0-alpine as build

WORKDIR /app

COPY ./package.json ./
RUN npm install

COPY ./ ./

RUN npm run build


# Final step
FROM node:14.14.0-alpine as start

WORKDIR /app

COPY --from=build /app/package.json .
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["npm", "start"]