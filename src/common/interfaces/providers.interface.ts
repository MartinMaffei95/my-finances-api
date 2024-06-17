export type ProvidersOptionName =
  | 'DATABASE_CONNECTION'
  | 'PRODUCT_MODEL'
  | 'RECIPE_MODEL';

export type ProvidersOption = { [optionName in ProvidersOptionName]: string };
