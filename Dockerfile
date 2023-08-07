FROM docker.io/library/node:18
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json yarn.lock ./
RUN yarn install


# Copy app files
COPY tsconfig.json .
COPY src ./src

# Compile app code
RUN npx tsc

# Cleanup
RUN yarn install --production && rm -rf src tsconfig.json

USER 1000
ENTRYPOINT ["/usr/local/bin/node","/usr/src/app/dist"]
