export const MOBILE_BANNER_WIDTH_RATIO = 0.965;

export const CREATION_BANNER_HEIGHT_TO_FONT_RATIO = 3.50;

export function getSharedLobbyWidth(screenWidth: number): number {
  return screenWidth * (screenWidth < 820 ? 1 : 0.44);
}

export function getSharedLobbyAlignment(screenWidth: number): 'center' | 'flex-end' {
  return screenWidth < 820 ? 'center' : 'flex-end';
}

export function getSharedLobbyHeadingTopGap(screenHeight: number): number {
  return screenHeight * 0.04;
}

export function getSharedLobbyTitleBannerGap(screenHeight: number): number {
  return screenHeight * 0.015;
}

export function getSharedLobbyBannerTitleGap(screenHeight: number): number {
  return screenHeight * 0.03;
}

export function getSharedLobbySidebarWidth(screenWidth: number): number {
  return screenWidth * (screenWidth < 820 ? 0 : 0.24);
}

export function getSharedLobbyRightZoneWidth(screenWidth: number): number {
  return screenWidth * (screenWidth < 820 ? 0 : 0.28);
}

export function getSharedLobbyOuterMargin(screenWidth: number): number {
  return screenWidth * (screenWidth < 820 ? 0 : 0.02);
}

export const SHARED_LOBBY_BANNER_WIDTH_RATIO = 0.96;

export function getSharedLobbyBannerWidthPercent(screenWidth: number): `${number}%` {
  return `${(screenWidth < 820 ? MOBILE_BANNER_WIDTH_RATIO : SHARED_LOBBY_BANNER_WIDTH_RATIO) * 100}%`;
}

export function getSharedLobbyBannerWidth(panelWidth: number, screenWidth: number): number {
  return screenWidth < 820
    ? screenWidth * MOBILE_BANNER_WIDTH_RATIO
    : panelWidth * SHARED_LOBBY_BANNER_WIDTH_RATIO;
}

export function getSharedLobbyBannerInset(panelWidth: number, screenWidth: number): number {
  return (panelWidth - getSharedLobbyBannerWidth(panelWidth, screenWidth)) / 2;
}
