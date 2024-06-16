import {
  ActionRowBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "@discordjs/builders";
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
  const firstDeck = new StringSelectMenuBuilder()
    .setCustomId("first_deck")
    .setPlaceholder("先攻デッキ")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("リザードンex")
        .setDescription("悪リザードンexを主軸としたデッキ")
        .setValue("charizard-ex"),
      new StringSelectMenuOptionBuilder()
        .setLabel("ハバタクカミサーフゴー")
        .setDescription("ハバタクカミとサーフゴーexを主軸としてデッキ")
        .setValue("flutter-mane-gholdengo-ex"),
    );
  const secondDeck = new StringSelectMenuBuilder()
    .setCustomId("first_deck")
    .setPlaceholder("先攻デッキ")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("リザードンex")
        .setDescription("悪リザードンexを主軸としたデッキ")
        .setValue("charizard-ex"),
      new StringSelectMenuOptionBuilder()
        .setLabel("ハバタクカミサーフゴー")
        .setDescription("ハバタクカミとサーフゴーexを主軸としてデッキ")
        .setValue("flutter-mane-gholdengo-ex"),
    );

  const deckRow = new ActionRowBuilder().addComponents(firstDeck, secondDeck);

  res.send({
    type: InteractionResponseType.MODAL,
    data: {
      components: [deckRow.toJSON()],
    },
  });
}
