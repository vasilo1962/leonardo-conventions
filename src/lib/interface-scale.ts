export const TEXT_FRAME_RATIO = 1.6;
const MOBILE_WIDTH_FONT_MULTIPLIER = 1.8;

export function responsiveHeightFontSize(
  heightBasedFontSize: number,
  screenWidth: number,
  screenHeight: number,
  isMobile: boolean
): number {
  if (!isMobile || screenHeight <= 0) {
    return heightBasedFontSize;
  }

  const heightRatio = heightBasedFontSize / screenHeight;

  return Math.max(
    heightBasedFontSize * 0.95,
    heightRatio * MOBILE_WIDTH_FONT_MULTIPLIER * screenWidth
  );
}


export function getDeviceFontRatio(): number {
  return 1;
}

export function deviceScaledSize(
  laptopSize: number
): number {
  return laptopSize;
}

export function textFrameHeight(
  largestFontHeight: number,
  lineCount = 1
): number {
  return (
    deviceScaledSize(largestFontHeight * lineCount) *
    TEXT_FRAME_RATIO
  );
}
