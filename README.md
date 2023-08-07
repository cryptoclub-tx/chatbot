# chatbot
Chatbot for Discord server

## Quick Start
```sh
# Build the image (w/ build output)
podman build .

# Build & run the image (no build output)
podman run --rm -it -e DISCORD_TOKEN -e DISCORD_APPLICATION_ID $(podman build -q .)
```

## Deployment
This section assumes you have a running Kubernetes cluster with `kubectl` configured.

### Credentials
Ensure all necessary environment variables are defined and then run:
```sh
kubectl create secret generic discord-bot-credentials \
  --from-literal=application_id=${DISCORD_APPLICATION_ID} \
  --from-literal=public_key=${DISCORD_PUBLIC_KEY} \
  --from-literal=token=${DISCORD_TOKEN}
```

### Workloads
After creating the secret, deploy the app itself.
```sh
kubectl apply -k ./deploy/
```
