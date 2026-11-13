export const LIGHT_POPUP_TITLE_FONT_RATIO = 0.025;
export const LIGHT_POPUP_MESSAGE_FONT_RATIO = 0.022;
export const LIGHT_POPUP_BUTTON_FONT_RATIO = 0.020;
export const LIGHT_POPUP_SECONDARY_ACTION_FONT_RATIO = 0.020;
export const LIGHT_POPUP_TITLE_LETTER_SPACING_TO_FONT_RATIO = 0.03;
export const LIGHT_POPUP_BUTTON_LETTER_SPACING_TO_FONT_RATIO = 0.03;
export const LIGHT_POPUP_LANGUAGE_CONTROL_FONT_RATIO = 0.018;
export const LIGHT_POPUP_CLOSE_FONT_RATIO = 0.030;
export const LIGHT_POPUP_LANGUAGE_CONTROL_HEIGHT_TO_FONT_RATIO = 1.60;
export const LIGHT_POPUP_LANGUAGE_CONTROL_HORIZONTAL_PADDING_TO_FONT_RATIO = 0.50;
export const LIGHT_POPUP_LANGUAGE_CONTROL_LINE_HEIGHT_TO_FONT_RATIO = 1.25;
export const LIGHT_POPUP_LANGUAGE_CONTROL_LETTER_SPACING = 0;
export const LIGHT_POPUP_LANGUAGE_CONTROL_TOP_TO_FONT_RATIO = 0.75;
export const LIGHT_POPUP_LANGUAGE_CONTROL_RIGHT_TO_FONT_RATIO = 1.00;
export const LIGHT_POPUP_CLOSE_TOP_TO_LANGUAGE_FONT_RATIO = 0.50;
export const LIGHT_POPUP_LANGUAGE_CONTROL_TITLE_GAP_TO_TITLE_FONT_RATIO = 0.80;
export const LIGHT_POPUP_MESSAGE_LINE_HEIGHT_RATIO = 1.30;
export const LIGHT_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO = 2.00;
export const LIGHT_POPUP_TITLE_MESSAGE_GAP_TO_TITLE_FONT_RATIO = 0.80;
export const LIGHT_POPUP_MESSAGE_ACTION_GAP_TO_MESSAGE_FONT_RATIO = 1.80;
export const LIGHT_POPUP_BUTTON_HEIGHT_TO_FONT_RATIO = 2.00;
export const LIGHT_POPUP_BUTTON_HORIZONTAL_PADDING_TO_FONT_RATIO = 3.00;
export const LIGHT_POPUP_SMALL_LAPTOP_MAX_WIDTH_RATIO = 0.40;
export const LIGHT_POPUP_SMALL_MOBILE_MAX_WIDTH_RATIO = 0.80;
export const LIGHT_POPUP_SMALL_TABLE_AREA_MAX_WIDTH_RATIO = 0.50;
export const LIGHT_POPUP_LAPTOP_MAX_WIDTH_RATIO = 0.60;
export const LIGHT_POPUP_MOBILE_MAX_WIDTH_RATIO = 0.96;
export const LIGHT_POPUP_TABLE_AREA_MAX_WIDTH_RATIO = 0.70;
export const LIGHT_POPUP_PREFERRED_ASPECT_RATIO = 1.80;
export const LIGHT_POPUP_MIN_ASPECT_RATIO = 1.50;
export const LIGHT_POPUP_MAX_ASPECT_RATIO = 2.00;
export const LIGHT_POPUP_FRAME_BORDER_TO_SCREEN_HEIGHT_RATIO = 0.002;
export const LIGHT_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO = 0.001;
export const LIGHT_POPUP_FRAME_RADIUS_TO_HEIGHT_RATIO = 0.24;
export const LIGHT_POPUP_FRAME_RADIUS_TO_SCREEN_HEIGHT_RATIO = 0.02;
export const LIGHT_POPUP_BUTTON_RADIUS_TO_HEIGHT_RATIO = 0.375;

export const LIGHT_POPUP_FRAME_BACKGROUND_COLOR = '#faf4ee';
export const LIGHT_POPUP_FRAME_BORDER_COLOR = '#4b7198';
export const LIGHT_POPUP_PRIMARY_BUTTON_BACKGROUND_COLOR = '#edf3f8';
export const LIGHT_POPUP_PRIMARY_BUTTON_BORDER_COLOR = '#0a3c6a';
export const LIGHT_POPUP_SECONDARY_BUTTON_BACKGROUND_COLOR = '#faf4ee';
export const LIGHT_POPUP_SECONDARY_BUTTON_BORDER_COLOR = '#0a3c6a';
export const LIGHT_POPUP_SELECTED_OPTION_BACKGROUND_COLOR = '#edf3f8';
export const LIGHT_POPUP_SELECTED_OPTION_BORDER_COLOR = '#0a3c6a';
export const LIGHT_POPUP_TITLE_COLOR = '#0a3c6a';
export const LIGHT_POPUP_MESSAGE_COLOR = '#4b7198';
export const LIGHT_POPUP_BUTTON_COLOR = '#0a3c6a';
export const LIGHT_POPUP_SECONDARY_ACTION_COLOR = '#4b7198';


function measureLightPopupTextWidth(text: string, fontSize: number): number {
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

export function getTranslatedLightPopupButtonHeight(
  fontSize: number,
  isMobile: boolean,
  singleLine = false
): number {
  const lineCount = isMobile && !singleLine ? 2 : 1;
  return fontSize * LIGHT_POPUP_BUTTON_HEIGHT_TO_FONT_RATIO * lineCount;
}

export function getLightPopupButtonHeight(
  label: string,
  fontSize: number
): number {
  const lineCount = Math.max(1, label.split('\n').length);
  return fontSize * LIGHT_POPUP_BUTTON_HEIGHT_TO_FONT_RATIO * lineCount;
}

export function getEqualLightPopupButtonWidth(
  labels: string[],
  fontSize: number,
  maxWidth = Number.POSITIVE_INFINITY
): number {
  const textWidth = Math.max(
    ...labels.map(label => measureLightPopupTextWidth(label, fontSize))
  );

  return Math.min(
    maxWidth,
    textWidth
      + fontSize * LIGHT_POPUP_BUTTON_HORIZONTAL_PADDING_TO_FONT_RATIO
  );
}

export function getLightPopupButtonRadius(buttonHeight: number): number {
  return buttonHeight * LIGHT_POPUP_BUTTON_RADIUS_TO_HEIGHT_RATIO;
}

export function getLightPopupFrameRadius(
  frameHeight: number,
  screenHeight: number
): number {
  return Math.min(
    frameHeight * LIGHT_POPUP_FRAME_RADIUS_TO_HEIGHT_RATIO,
    screenHeight * LIGHT_POPUP_FRAME_RADIUS_TO_SCREEN_HEIGHT_RATIO
  );
}

export function getBalancedLightPopupWidth(
  currentWidth: number,
  frameHeight: number,
  maxWidth: number,
  minWidth = 0
): number {
  if (
    currentWidth <= 0
    || frameHeight <= 0
    || maxWidth <= 0
  ) {
    return maxWidth;
  }

  const currentRatio = currentWidth / frameHeight;

  if (
    currentRatio >= LIGHT_POPUP_MIN_ASPECT_RATIO
    && currentRatio <= LIGHT_POPUP_MAX_ASPECT_RATIO
  ) {
    return currentWidth;
  }

  const preferredWidth = Math.min(
    maxWidth,
    Math.max(
      minWidth,
      frameHeight * LIGHT_POPUP_PREFERRED_ASPECT_RATIO
    )
  );

  return Math.min(
    maxWidth,
    Math.max(
      minWidth,
      (currentWidth + preferredWidth) / 2
    )
  );
}
