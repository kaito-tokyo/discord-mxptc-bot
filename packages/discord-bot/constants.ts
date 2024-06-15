import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export function loadDiscordApplicationId(): string {
  const discordApplicationId = process.env["DISCORD_APPLICATION_ID"];
  if (!discordApplicationId) {
    throw new Error("DISCORD_APPLICATION_ID is not set");
  }
  return discordApplicationId;
}

export function loadDiscordPublicKey(): string {
  const discordPublicKey = process.env["DISCORD_PUBLIC_KEY"];
  if (!discordPublicKey) {
    throw new Error("DISCORD_PUBLIC_KEY is not set");
  }
  return discordPublicKey;
}

export async function loadDiscordBotToken(): Promise<string> {
  const discordBotTokenSecretId = process.env["DISCORD_BOT_TOKEN_SECRET_ID"];
  if (!discordBotTokenSecretId) {
    throw new Error("DISCORD_BOT_TOKEN_SECRET_ID is not set");
  }

  const client = new SecretManagerServiceClient();
  const [response] = await client.accessSecretVersion({
    name: discordBotTokenSecretId,
  });
  const discordBotToken = response.payload?.data?.toString();
  if (!discordBotToken) {
    throw new Error("Failed to load Discord bot token");
  }

  return discordBotToken;
}
