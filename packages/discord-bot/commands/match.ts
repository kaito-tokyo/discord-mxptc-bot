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
const firstPlayerOptionName = "first-player";
const secondPlayerOptionName = "second-player";

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
  )
  .addStringOption((option) =>
    option
      .setName(firstPlayerOptionName)
      .setDescription("先攻プレイヤー名")
      .setRequired(false)
      .setAutocomplete(true),
  )
  .addStringOption((option) =>
    option
      .setName(secondPlayerOptionName)
      .setDescription("後攻プレイヤー名")
      .setRequired(false)
      .setAutocomplete(true),
  );

function compact(array: (string | undefined)[]): string[] {
  return array.flatMap((e) => (e == null ? [] : [e]));
}

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
  let firstPlayer: string | undefined;
  let secondPlayer: string | undefined;
  for (const { name, value } of options) {
    if (name === firstDeckOptionName && typeof value === "string") {
      firstDeck = value;
    } else if (name === secondDeckOptionName && typeof value === "string") {
      secondDeck = value;
    } else if (name === winnerOptionName && typeof value === "string") {
      winner = value;
    } else if (name === firstPlayer && typeof value === "string") {
      firstPlayer = value;
    } else if (name === secondPlayer && typeof value === "string") {
      secondPlayer = value;
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

  let winDecks: string[];
  let loseDecks: string[];
  if (winner === "first") {
    winDecks = [firstDeck];
    loseDecks = [secondDeck];
  } else if (winner === "second") {
    winDecks = [secondDeck];
    loseDecks = [firstDeck];
  } else if (winner === "draw") {
    winDecks = [];
    loseDecks = [firstDeck, secondDeck];
  } else {
    throw new Error(`Invalid winner: ${winner}`);
  }

  let optionalWinPlayers: (string | undefined)[];
  let optionalLosePlayers: (string | undefined)[];
  if (winner === "first") {
    optionalWinPlayers = [firstPlayer].filter((e) => !!e);
    optionalLosePlayers = [secondPlayer];
  } else if (winner === "second") {
    optionalWinPlayers = [secondPlayer];
    optionalLosePlayers = [firstPlayer];
  } else if (winner === "draw") {
    optionalWinPlayers = [];
    optionalLosePlayers = [firstPlayer, secondPlayer];
  } else {
    throw new Error(`Invalid winner: ${winner}`);
  }
  const winPlayers = compact(optionalWinPlayers);
  const losePlayers = compact(optionalLosePlayers);

  const createdAt = new Date().toISOString();
  const match = {
    createdAt,
    firstDeck,
    secondDeck,
    winner,
    firstPlayer,
    secondPlayer,
    winDecks,
    loseDecks,
    winPlayers,
    losePlayers,
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
      content: `登録完了 勝利デッキ：${winDecks.join(",")} 敗北デッキ：${loseDecks.join(",")} 勝利プレイヤー：${winPlayers.join(",")} 敗北プレイヤー：${losePlayers.join(",")}`,
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

  let collectionName: string;
  if ([firstDeckOptionName, secondDeckOptionName].includes(name)) {
    collectionName = "decktypes";
  } else if ([firstPlayerOptionName, secondPlayerOptionName].includes(name)) {
    collectionName = "players";
  } else {
    res.status(204).send("");
    return;
  }

  let choices: APIApplicationCommandOptionChoice<string>[] = [];
  const firestore = new Firestore({
    databaseId: firestoreDatabaseId,
  });
  const documentRefs = await firestore
    .collection(collectionName)
    .listDocuments();
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

  res.send({
    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
    data: {
      choices,
    },
  } satisfies APIApplicationCommandAutocompleteResponse);
}
