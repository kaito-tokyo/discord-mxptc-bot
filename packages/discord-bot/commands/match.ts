import { SlashCommandBuilder } from "@discordjs/builders";
import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
} from "discord-api-types/v10";
import { InteractionResponseType } from "discord-interactions";
import type { Response } from "express";

export const data = new SlashCommandBuilder()
  .setName("match")
  .setDescription("試合の勝敗を登録します。")
  .addStringOption((option) =>
    option
      .setName("先攻デッキ")
      .setDescription("先攻のデッキタイプ")
      .setAutocomplete(true),
  )
  .addStringOption((option) =>
    option
      .setName("後攻デッキ")
      .setDescription("後攻のデッキタイプ")
      .setAutocomplete(true),
  );

export function execute(
  _interaction: APIApplicationCommandInteraction,
  res: Response,
) {
  res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: "登録完了しました！",
    },
  });
}

export async function autocomplete(
  interaction: APIApplicationCommandAutocompleteInteraction,
  res: Response,
) {
  console.log(JSON.stringify(interaction));
}
