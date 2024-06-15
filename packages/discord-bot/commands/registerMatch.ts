import { SlashCommandBuilder } from "@discordjs/builders";
import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { InteractionResponseType } from "discord-interactions";
import type { Response } from "express";

export const data = new SlashCommandBuilder()
  .setName("match")
  .setDescription("試合の勝敗を登録します。");

export function execute(
  _interaction: APIApplicationCommandInteraction,
  res: Response,
) {
  res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "開発中です...",
    },
  });
}
