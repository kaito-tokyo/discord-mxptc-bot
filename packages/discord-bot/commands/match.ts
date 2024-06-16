import { SlashCommandBuilder } from "@discordjs/builders";
import {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIApplicationCommandAutocompleteResponse,
  InteractionResponseType,
} from "discord-api-types/v10";
import type { Response } from "express";
import {
  MyApplicationCommandAutocompleteInteractionDataOption,
  MyApplicationCommandInteractionDataOption,
} from "../types.js";

const commandName = "match";
const firstDeckOptionName = "first-deck";
const secondDeckOptionName = "second-deck";

const choices = [
  {
    name: "リザードンex",
    value: "charizard-ex",
  },
  {
    name: "ハバタクカミサーフゴーex",
    value: "flutter-mane-gholdengo-ex",
  },
];

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription("試合の勝敗を登録します。")
  .addStringOption((option) =>
    option
      .setName(firstDeckOptionName)
      .setDescription("先攻のデッキタイプ")
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addStringOption((option) =>
    option
      .setName(secondDeckOptionName)
      .setDescription("後攻のデッキタイプ")
      .setRequired(true)
      .setAutocomplete(true),
  );

export function execute(
  interaction: APIChatInputApplicationCommandInteraction,
  res: Response,
) {
  const options = interaction.data.options as
    | MyApplicationCommandInteractionDataOption[]
    | undefined;
  if (options == null) {
    throw new Error("options is null!");
  }

  let firstDeck: string | undefined;
  let secondDeck: string | undefined;
  for (const { name, value } of options) {
    if (name === firstDeckOptionName && typeof value === "string") {
      firstDeck = value;
    } else if (name === secondDeckOptionName && typeof value === "string") {
      secondDeck = value;
    }
  }
  if (firstDeck == null) {
    throw new Error("first-deck is null!");
  }
  if (secondDeck == null) {
    throw new Error("second-deck is null!");
  }

  res.send({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `登録完了 先攻：${firstDeck} 後攻：${secondDeck}`,
    },
  });
}

export async function autocomplete(
  interaction: APIApplicationCommandAutocompleteInteraction,
  res: Response,
) {
  const options = interaction.data
    .options as MyApplicationCommandAutocompleteInteractionDataOption[];

  const focusedOption = options.find((option) => option.focused);
  if (focusedOption == null) {
    res.status(204).send("");
    return;
  }
  const { name } = focusedOption;

  if (["first-deck", "second-deck"].includes(name)) {
    res.send({
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices,
      },
    } satisfies APIApplicationCommandAutocompleteResponse);
  }
}
