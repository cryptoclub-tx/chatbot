export default {
  discord: {
    application_id: process.env['DISCORD_APPLICATION_ID'] as string,
    public_key: process.env['DISCORD_PUBLIC_KEY'] as string,
    token: process.env['DISCORD_TOKEN'] as string,
  },
  http: {
    port: Number(process.env['HTTP_PORT'] || 3000),
  },
  metrics: {
    enable_default: Boolean(process.env['METRICS_ENABLE_DEFAULT'])
  },
};
