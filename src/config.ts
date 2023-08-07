export default {
  discord: {
    application_id: process.env['DISCORD_APPLICATION_ID'] as string,
    public_key: process.env['DISCORD_PUBLIC_KEY'] as string,
    token: process.env['DISCORD_TOKEN'] as string,
  }
};
