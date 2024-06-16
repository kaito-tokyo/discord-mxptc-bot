import { SlashCommandBuilder } from "@discordjs/builders";
import {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIApplicationCommandAutocompleteResponse,
  InteractionResponseType,
  APIApplicationCommandOptionChoice,
} from "discord-api-types/v10";
import type { Response } from "express";

import { Firestore } from "@google-cloud/firestore";
import { Storage } from "@google-cloud/storage";

import {
  MyApplicationCommandAutocompleteInteractionDataOption,
  MyApplicationCommandInteractionDataOption,
} from "../types.js";
import { firestoreDatabaseId, loadMatchesBucketName } from "../constants.js";

const commandName = "match";
const firstDeckOptionName = "first-deck";
const secondDeckOptionName = "second-deck";
const winnerOptionName = "winner";

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
  )
  .addStringOption((option) =>
    option
      .setName(winnerOptionName)
      .setDescription("勝者")
      .setRequired(true)
      .addChoices([
        {
          name: "先攻",
          value: "first",
        },
        {
          name: "後攻",
          value: "second",
        },
        {
          name: "引き分け",
          value: "draw",
        },
      ]),
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
  let winner: string | undefined;
  for (const { name, value } of options) {
    if (name === firstDeckOptionName && typeof value === "string") {
      firstDeck = value;
    } else if (name === secondDeckOptionName && typeof value === "string") {
      secondDeck = value;
    } else if (name === winnerOptionName && typeof value === "string") {
      winner = value;
    }
  }
  if (firstDeck == null) {
    throw new Error("first-deck is null!");
  }
  if (secondDeck == null) {
    throw new Error("second-deck is null!");
  }
  if (winner == null) {
    throw new Error("winner is null!");
  }

  const createdAt = new Date().toISOString();
  const match = {
    createdAt,
    firstDeck,
    secondDeck,
    winner,
  };
  const filename = `${createdAt}.json`;

  const storage = new Storage();
  storage
    .bucket(loadMatchesBucketName())
    .file(filename)
    .save(JSON.stringify(match));

  res.send({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `登録完了 先攻：${firstDeck} 後攻：${secondDeck} 勝者：${winner}`,
    },
  });
}

export async function autocomplete(
  interaction: APIApplicationCommandAutocompleteInteraction,
  res: Response,
) {
  let choices: APIApplicationCommandOptionChoice<string>[] = [];
  const firestore = new Firestore({
    databaseId: firestoreDatabaseId,
  });
  const documentRefs = await firestore.collection("decktypes").listDocuments();
  const documentSnapshots = await firestore.getAll(...documentRefs);
  for (const documentSnapshot of documentSnapshots) {
    if (documentSnapshot.exists) {
      const name = documentSnapshot.data()?.["name"];
      if (name == null) {
        continue;
      }
      choices = [
        ...choices,
        {
          name,
          value: documentSnapshot.id,
        },
      ];
    }
  }

  const options = interaction.data
    .options as MyApplicationCommandAutocompleteInteractionDataOption[];

  const focusedOption = options.find((option) => option.focused);
  if (focusedOption == null) {
    res.status(204).send("");
    return;
  }
  const { name } = focusedOption;

  if ([firstDeckOptionName, secondDeckOptionName].includes(name)) {
    res.send({
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices,
      },
    } satisfies APIApplicationCommandAutocompleteResponse);
  }
}
