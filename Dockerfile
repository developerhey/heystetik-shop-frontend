FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
# Set environment variables for build stage
ENV VITE_API_URL=https://api.heystetik.com/
ENV VITE_API_URL_FILES=https://api.heystetik.com/files/
ENV VITE_SESSION_SECRET=DX21232Xu56xt6cyfdYyM56TwSe
ENV VITE_GOOGLE_OAUTH_CLIENT_ID=134252770117-48fcf8fqc02jabd2h2v9a0fiok39kqj0.apps.googleusercontent.com
ENV VITE_GOOGLE_MAP_API_KEY=AIzaSyCF5fKaL91ofgj1uusPnnPJEIzA3l7DnmE
RUN npm run build

EXPOSE 5173
FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
# Set environment variables for runtime
ENV VITE_API_URL=https://api.heystetik.com/
ENV VITE_API_URL_FILES=https://api.heystetik.com/files/
ENV VITE_SESSION_SECRET=DX21232Xu56xt6cyfdYyM56TwSe
ENV API_URL=https://api.heystetik.com/
ENV VITE_GOOGLE_OAUTH_CLIENT_ID=134252770117-48fcf8fqc02jabd2h2v9a0fiok39kqj0.apps.googleusercontent.com
ENV GOOGLE_OAUTH_CLIENT_SECRET=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
ENV VITE_GOOGLE_MAP_API_KEY=AIzaSyCF5fKaL91ofgj1uusPnnPJEIzA3l7DnmE
ENV PORT=5173
CMD ["npm", "run", "start"]