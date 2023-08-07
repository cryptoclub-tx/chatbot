# chatbot
Chatbot for Discord server

## Quick Start
```sh
# Build the image (w/ build output)
podman build .

# Build & run the image (no build output)
podman run --rm -it -e DISCORD_TOKEN -e DISCORD_APPLICATION_ID $(podman build -q .)
```
