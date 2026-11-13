export const BLUE_POPUP_SMALL_LAPTOP_MAX_WIDTH_RATIO = 0.40;
export const BLUE_POPUP_SMALL_MOBILE_MAX_WIDTH_RATIO = 0.80;
export const BLUE_POPUP_SMALL_TABLE_AREA_MAX_WIDTH_RATIO = 0.50;
export const BLUE_POPUP_LAPTOP_MAX_WIDTH_RATIO = 0.60;
export const BLUE_POPUP_MOBILE_MAX_WIDTH_RATIO = 0.96;
export const BLUE_POPUP_TABLE_AREA_MAX_WIDTH_RATIO = 0.70;

export const BLUE_POPUP_TITLE_FONT_RATIO = 0.025;
export const BLUE_POPUP_MESSAGE_FONT_RATIO = 0.022;
export const BLUE_POPUP_BUTTON_FONT_RATIO = 0.020;
export const BLUE_POPUP_TITLE_LETTER_SPACING_TO_FONT_RATIO = 0.03;
export const BLUE_POPUP_BUTTON_LETTER_SPACING_TO_FONT_RATIO = 0.03;
export const BLUE_POPUP_MESSAGE_LINE_HEIGHT_RATIO = 1.30;
export const BLUE_POPUP_LANGUAGE_CONTROL_FONT_RATIO = 0.018;
export const BLUE_POPUP_CLOSE_FONT_RATIO = 0.030;
export const BLUE_POPUP_LANGUAGE_CONTROL_HEIGHT_TO_FONT_RATIO = 1.60;
export const BLUE_POPUP_LANGUAGE_CONTROL_HORIZONTAL_PADDING_TO_FONT_RATIO = 0.50;
export const BLUE_POPUP_LANGUAGE_CONTROL_LINE_HEIGHT_TO_FONT_RATIO = 1.25;
export const BLUE_POPUP_LANGUAGE_CONTROL_LETTER_SPACING = 0;
export const BLUE_POPUP_LANGUAGE_CONTROL_TOP_TO_FONT_RATIO = 0.75;
export const BLUE_POPUP_LANGUAGE_CONTROL_RIGHT_TO_FONT_RATIO = 1.00;
export const BLUE_POPUP_CLOSE_TOP_TO_LANGUAGE_FONT_RATIO = 0.50;
export const BLUE_POPUP_LANGUAGE_CONTROL_TITLE_GAP_TO_TITLE_FONT_RATIO = 0.80;

export const BLUE_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO = 2.00;
export const BLUE_POPUP_TITLE_MESSAGE_GAP_TO_TITLE_FONT_RATIO = 0.80;
export const BLUE_POPUP_MESSAGE_ACTION_GAP_TO_MESSAGE_FONT_RATIO = 1.80;
export const BLUE_POPUP_BUTTON_HORIZONTAL_PADDING_TO_FONT_RATIO = 3.00;
export const BLUE_POPUP_BUTTON_HEIGHT_PER_LINE_TO_FONT_RATIO = 2.00;
export const BLUE_POPUP_TRANSLATED_BUTTON_LAPTOP_LINE_COUNT = 1;
export const BLUE_POPUP_TRANSLATED_BUTTON_MOBILE_LINE_COUNT = 2;

export const BLUE_POPUP_FRAME_BORDER_TO_SCREEN_HEIGHT_RATIO = 0.002;
export const BLUE_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO = 0.001;
export const BLUE_POPUP_RADIUS_TO_HEIGHT_RATIO = 0.24;
export const BLUE_POPUP_MAX_RADIUS_TO_SCREEN_HEIGHT_RATIO = 0.02;
export const BLUE_POPUP_BUTTON_RADIUS_TO_HEIGHT_RATIO = 0.375;

export const BLUE_POPUP_FRAME_BACKGROUND_COLOR = '#f3f8fc';
export const BLUE_POPUP_FRAME_BORDER_COLOR = '#4b7198';
export const BLUE_POPUP_TITLE_COLOR = '#0a3c6a';
export const BLUE_POPUP_MESSAGE_COLOR = '#4b7198';
export const BLUE_POPUP_BUTTON_BACKGROUND_COLOR = '#edf3f8';
export const BLUE_POPUP_BUTTON_BORDER_COLOR = '#4b7198';
export const BLUE_POPUP_BUTTON_COLOR = '#0a3c6a';

export function getTranslatedBluePopupButtonHeight(
  fontSize: number,
  isMobile: boolean,
  singleLine = false
): number {
  const lineCount = isMobile && !singleLine
    ? BLUE_POPUP_TRANSLATED_BUTTON_MOBILE_LINE_COUNT
    : BLUE_POPUP_TRANSLATED_BUTTON_LAPTOP_LINE_COUNT;

  return fontSize * BLUE_POPUP_BUTTON_HEIGHT_PER_LINE_TO_FONT_RATIO * lineCount;
}

export function getBluePopupRadius(
  frameHeight: number,
  screenHeight: number
): number {
  return Math.min(
    frameHeight * BLUE_POPUP_RADIUS_TO_HEIGHT_RATIO,
    screenHeight * BLUE_POPUP_MAX_RADIUS_TO_SCREEN_HEIGHT_RATIO
  );
}


export function getBluePopupButtonRadius(buttonHeight: number): number {
  return buttonHeight * BLUE_POPUP_BUTTON_RADIUS_TO_HEIGHT_RATIO;
}

function measureBluePopupTextWidth(text: string, fontSize: number): number {
  const lines = text.split('\n');

  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context) {
      context.font = `900 ${fontSize}px Arial`;
      return Math.max(...lines.map(line => context.measureText(line).width));
    }
  }

  return Math.max(...lines.map(line => line.length * fontSize * 0.62));
}

export function getEqualBluePopupButtonWidth(
  labels: string[],
  fontSize: number,
  maxWidth: number
): number {
  const textWidth = Math.max(
    ...labels.map(label => measureBluePopupTextWidth(label, fontSize))
  );

  return Math.min(
    maxWidth,
    textWidth
      + fontSize * BLUE_POPUP_BUTTON_HORIZONTAL_PADDING_TO_FONT_RATIO
  );
}
