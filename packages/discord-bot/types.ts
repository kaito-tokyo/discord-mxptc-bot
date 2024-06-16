export interface MyApplicationCommandInteractionDataOption {
  readonly name: string;
  readonly type: number;
  readonly value?: string | number | boolean;
}

export interface MyApplicationCommandAutocompleteInteractionDataOption {
  readonly name: string;
  readonly type: number;
  readonly value?: string | number | boolean;
  readonly focused?: boolean;
}
