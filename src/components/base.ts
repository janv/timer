import * as Color from 'color';
import { mapValues } from "lodash";

export const margin = 10
export const borderRadiusSmall = 5
export const inputBorderRadius = borderRadiusSmall

// Colors //////////////////////////////////////////////////////////////////////////////////////////////////////////////

export namespace colorValues {
  export const gray = Color('gray')
  export const silver = Color('silver')

  export const primary = Color('blue')
  export const highlight = primary.lighten(0.5)
}

type ColorStrings = {
  [Name in keyof typeof colorValues]: string;
}

export const colors:ColorStrings = mapValues<typeof colorValues, string>(colorValues, c => c.toString()) as any