import { SlashCommandBuilder } from "@discordjs/builders";
import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIApplicationCommandAutocompleteResponse,
  InteractionResponseType,
} from "discord-api-types/v10";
import type { Response } from "express";

export const data = new SlashCommandBuilder()
  .setName("match")
  .setDescription("試合の勝敗を登録します。")
  .addStringOption((option) =>
    option
      .setName("first-deck")
      .setDescription("先攻のデッキタイプ")
      .setAutocomplete(true),
  )
  .addStringOption((option) =>
    option
      .setName("second-deck")
      .setDescription("後攻のデッキタイプ")
      .setAutocomplete(true),
  );

export function execute(
  _interaction: APIApplicationCommandInteraction,
  res: Response,
) {
  res.send({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "登録完了しました！",
    },
  });
}

interface ApplicationCommandAutocompleteOption {
  readonly name: string;
  readonly type: number;
  readonly value?: string | number | boolean;
  readonly focused?: boolean;
}

export async function autocomplete(
  interaction: APIApplicationCommandAutocompleteInteraction,
  res: Response,
) {
  const options = interaction.data
    .options as ApplicationCommandAutocompleteOption[];

  const focusedOption = options.find((option) => option.focused);
  if (focusedOption == null) {
    res.status(204).send("");
    return;
  }
  const { name } = focusedOption;

  if (["first-deck"].includes(name)) {
    res.send({
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices: [
          {
            name: "リザードンex",
            value: "charizard-exs",
          },
        ],
      },
    } satisfies APIApplicationCommandAutocompleteResponse);
  }
}
