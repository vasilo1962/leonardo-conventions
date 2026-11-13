import { applyMenuHoverText } from '@/lib/menu-hover-copy';
import { PRACTICE_MENU_TITLE } from '@/lib/practice-menu-copy';
import { getTeachingTableCopy, TEACHING_PLACE_TITLE } from '@/features/tables/teaching-table-copy';
import { menuControlName } from '@/shared/accessibility/menu-accessibility';
import { getInterfaceSpeechCopy } from '@/shared/accessibility/interface-speech-translations';
import { recordMenuNavigation } from '@/shared/accessibility/menu-navigation-announcements';
import { Link } from 'expo-router';
import { useState } from 'react';
import usePlayerLanguage from '@/hooks/use-player-language';
import { focusHoveredMenuControl } from '@/shared/accessibility/menu-hover-focus';

import {
  deviceScaledSize,
  responsiveHeightFontSize,
  textFrameHeight,
} from '@/lib/interface-scale';
import useGreekFederationAccess from '@/hooks/use-greek-federation-access';
import { getMenuSectionHeadingMetrics } from '@/lib/menu-section-heading';
import {
  MOBILE_BANNER_WIDTH_RATIO,
  getSharedLobbyBannerTitleGap,
  getSharedLobbyHeadingTopGap,
  getSharedLobbyTitleBannerGap,
} from '@/lib/shared-lobby-width';
import { MENU_ACTIVITY_COLORS, MENU_CATEGORY_COLORS } from '@/lib/menu-colors';
import {
  LIGHT_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO,
  LIGHT_POPUP_BUTTON_COLOR,
  LIGHT_POPUP_BUTTON_FONT_RATIO,
  LIGHT_POPUP_BUTTON_LETTER_SPACING_TO_FONT_RATIO,
  LIGHT_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO,
  LIGHT_POPUP_FRAME_BACKGROUND_COLOR,
  LIGHT_POPUP_FRAME_BORDER_COLOR,
  LIGHT_POPUP_FRAME_BORDER_TO_SCREEN_HEIGHT_RATIO,
  LIGHT_POPUP_SMALL_LAPTOP_MAX_WIDTH_RATIO,
  LIGHT_POPUP_SMALL_MOBILE_MAX_WIDTH_RATIO,
  LIGHT_POPUP_BUTTON_RADIUS_TO_HEIGHT_RATIO,
  LIGHT_POPUP_MESSAGE_ACTION_GAP_TO_MESSAGE_FONT_RATIO,
  LIGHT_POPUP_MESSAGE_COLOR,
  LIGHT_POPUP_MESSAGE_FONT_RATIO,
  LIGHT_POPUP_MESSAGE_LINE_HEIGHT_RATIO,
  LIGHT_POPUP_PRIMARY_BUTTON_BACKGROUND_COLOR,
  LIGHT_POPUP_PRIMARY_BUTTON_BORDER_COLOR,
  LIGHT_POPUP_TITLE_COLOR,
  LIGHT_POPUP_TITLE_FONT_RATIO,
  LIGHT_POPUP_TITLE_LETTER_SPACING_TO_FONT_RATIO,
  LIGHT_POPUP_TITLE_MESSAGE_GAP_TO_TITLE_FONT_RATIO,
  LIGHT_POPUP_SECONDARY_BUTTON_BACKGROUND_COLOR,
  LIGHT_POPUP_SECONDARY_BUTTON_BORDER_COLOR,
  getEqualLightPopupButtonWidth,
  getTranslatedLightPopupButtonHeight,
  getLightPopupFrameRadius,
} from '@/lib/light-popup-style';
import {
  BLUE_POPUP_BUTTON_BACKGROUND_COLOR,
  BLUE_POPUP_BUTTON_BORDER_COLOR,
  BLUE_POPUP_BUTTON_COLOR,
  BLUE_POPUP_FRAME_BACKGROUND_COLOR,
  BLUE_POPUP_FRAME_BORDER_COLOR,
  BLUE_POPUP_MESSAGE_COLOR,
  BLUE_POPUP_TITLE_COLOR,
} from '@/lib/blue-popup-style';

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';


import AppOverlay from '@/components/app-overlay';
import Text from '@/components/app-text';
import PopupLanguageControl from '@/components/popup-language-control';
import { usePopupLanguage } from '@/hooks/use-popup-language';
import { localizePlayMessage } from '@/lib/play-message-translations';
import { getSystemPopupCopy } from '@/lib/system-popup-translations';
type BrainathlonMenuScreenProps = {
  onPractice: () => void;
  onTry: () => void;
  onPartnershipPractice?: () => void;
  onDuel: () => void;
  onOpenTables?: () => void;
  onTeachingTable?: () => void;
  onSignIn: () => void;
  onDismissMessage: () => void;
  busyGame: 'practice' | null;
  onTournaments?: () => void;
  onResults?: () => void;
  onStatistics?: () => void;
  onFederationDeals?: () => void;
  federationDealsEnabled?: boolean;
  playMessage: string | null;
  lightPlayMessage?: boolean;
  bluePlayMessage?: boolean;
  username: string | null;
  showGuestWelcome?: boolean;
  sidebarActive?: 'statistics' | 'duel' | 'tournaments' | 'results' | 'tables' | 'federation' | 'guide' | 'teaching-table' | 'solo-practice' | 'partnership-practice';
  sidebarWidth?: number;
};


type MenuCardProps = {
  title: string;
  menuKey?: string;
  accessibilityLabel?: string;
  activity?: keyof typeof MENU_ACTIVITY_COLORS;
  subtitle: string;
  onPress?: () => void;
  busy?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  threeLine?: boolean;
  selected?: boolean;
  muted?: boolean;
  titleFontSize: number;
  subtitleFontSize: number;
  cardHeight: number;
  threeLineHeight: number;
  cardRadius: number;
  threeLineRadius: number;
  borderWidth: number;
};

function MenuCard({
  title,
  menuKey = title,
  accessibilityLabel,
  activity,
  subtitle,
  onPress,
  busy = false,
  disabled: unavailable = false,
  comingSoon = false,
  threeLine = false,
  selected = false,
  muted = false,
  titleFontSize,
  subtitleFontSize,
  cardHeight,
  threeLineHeight,
  cardRadius,
  threeLineRadius,
  borderWidth,
}: MenuCardProps) {
  const { language } = usePlayerLanguage();
  const spokenTitle = accessibilityLabel ?? menuControlName(menuKey, language);
  const disabled = selected || comingSoon || busy || !onPress;
  const spokenLabel = comingSoon
    ? `${spokenTitle}. ${getInterfaceSpeechCopy(language).comingSoon}`
    : spokenTitle;

  const card = (
    <Pressable
      accessibilityLanguage={language}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={spokenLabel}
      ref={node => applyMenuHoverText(node, menuKey)}
      aria-hidden={disabled ? true : undefined}
      onHoverIn={focusHoveredMenuControl}
      disabled={disabled}
      onPress={onPress ? () => { recordMenuNavigation(); onPress(); } : undefined}
      style={({ pressed }) => [
        styles.menuCard,
        {
          minHeight: muted && !selected
            ? ((threeLine ? 2 : 1) * titleFontSize + subtitleFontSize) * 1.50
            : threeLine ? threeLineHeight : cardHeight,
          borderRadius: threeLine ? threeLineRadius : cardRadius,
          borderWidth,
          paddingHorizontal: titleFontSize * (18 / 16),
        },
        activity && { backgroundColor: MENU_ACTIVITY_COLORS[activity] },
        selected && { borderColor: '#0a3c6a', borderWidth: borderWidth * 2 },
        comingSoon && styles.menuCardComingSoon,
        unavailable && styles.menuCardUnavailable,
        muted && !selected && {
          borderWidth: 0,
          borderBottomWidth: borderWidth,
          borderColor: '#b9c6d3',
          borderRadius: 0,
          shadowOpacity: 0,
          elevation: 0,
        },
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <View style={[styles.menuCardText, { paddingRight: titleFontSize * (12 / 16) }]}>
        <Text
          style={[
            styles.menuCardTitle,
            {
              fontSize: titleFontSize,
              lineHeight: titleFontSize * (20 / 16),
              letterSpacing: titleFontSize * (1.2 / 16),
            },
            comingSoon && styles.menuCardTitleComingSoon,
            unavailable && styles.menuCardTitleUnavailable,
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.menuCardSubtitle,
            {
              fontSize: subtitleFontSize,
              lineHeight: subtitleFontSize * (15 / 16),
              marginTop: subtitleFontSize * (2 / 16),
            },
            comingSoon && styles.menuCardSubtitleComingSoon,
            unavailable && styles.menuCardSubtitleUnavailable,
          ]}
        >
          {subtitle}
        </Text>
      </View>

      {busy ? <ActivityIndicator color="#0a3c6a" size="small" /> : null}
    </Pressable>
  );

  return disabled ? (
    <View
      role="group"
      aria-disabled
      accessibilityLabel={spokenLabel}
      ref={node => applyMenuHoverText(node, menuKey)}
      tabIndex={-1}
      onPointerEnter={focusHoveredMenuControl}
    >
      {card}
    </View>
  ) : card;
}

type WelcomeCardProps = {
  title: string;
  message: string;
  buttonLabel: string;
  onPress: () => void;
  emphasized?: boolean;
  busy?: boolean;
  titleFontSize: number;
  messageFontSize: number;
  buttonFontSize: number;
  cardHeight: number;
  contentPadding: number;
  borderWidth: number;
  cardRadius: number;
  buttonWidth?: number;
  screenHeight: number;
  onButtonTextWidth: (width: number) => void;
};

function WelcomeCard({
  title,
  message,
  buttonLabel,
  onPress,
  emphasized = false,
  busy = false,
  titleFontSize,
  messageFontSize,
  buttonFontSize,
  cardHeight,
  contentPadding,
  borderWidth,
  cardRadius,
  buttonWidth,
  screenHeight,
  onButtonTextWidth,
}: WelcomeCardProps) {
  const [buttonLineCount, setButtonLineCount] = useState(1);
  const buttonHeight = buttonLineCount * buttonFontSize * 1.60;
  const buttonRadius = Math.min(
    buttonHeight * 0.24,
    screenHeight * 0.02
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={buttonLabel}
      disabled={busy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.welcomeCard,
        {
          height: cardHeight,
          padding: contentPadding,
          borderWidth,
          borderRadius: cardRadius,
        },
        emphasized && styles.welcomeCardEmphasized,
        pressed && !busy && styles.buttonPressed,
      ]}
    >
      <Text
        scaleByDevice={false}
        style={[
          styles.welcomeCardTitle,
          {
            fontSize: titleFontSize,
            lineHeight: titleFontSize * (26 / 20),
            letterSpacing: titleFontSize * 0.03,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        scaleByDevice={false}
        style={[
          styles.welcomeCardMessage,
          {
            fontSize: messageFontSize,
            lineHeight: messageFontSize * (25 / 18),
            marginTop: titleFontSize * 0.4,
            letterSpacing: messageFontSize * 0.03,
          },
        ]}
      >
        {message}
      </Text>
      <View style={[
        styles.welcomeButton,
        {
          height: buttonHeight,
          marginTop: buttonFontSize * 0.5,
          width: buttonWidth,
          borderWidth,
          borderRadius: buttonRadius,
        },
        emphasized && styles.welcomeButtonEmphasized,
      ]}>
        {busy ? (
          <ActivityIndicator color="#0a3c6a" size="small" />
        ) : (
          <Text
            scaleByDevice={false}
            onLayout={(event) => {
              const textLayout = event.nativeEvent.layout;
              setButtonLineCount(
                Math.max(
                  Math.round(textLayout.height / buttonFontSize),
                  1
                )
              );
              onButtonTextWidth(textLayout.width);
            }}
            style={[
              styles.welcomeButtonText,
              {
                fontSize: buttonFontSize,
                letterSpacing: buttonFontSize * 0.03,
              },
              emphasized && styles.welcomeButtonTextEmphasized,
            ]}
          >
            {buttonLabel}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default function BrainathlonMenuScreen({
  onPractice,
  onTry,
  onPartnershipPractice,
  onDuel,
  onOpenTables,
  onTeachingTable,
  onSignIn,
  onDismissMessage,
  busyGame,
  onTournaments,
  onResults,
  onStatistics,
  onFederationDeals,
  federationDealsEnabled = false,
  playMessage,
  bluePlayMessage = false,
  username,
  showGuestWelcome = false,
  sidebarActive,
  sidebarWidth,
}: BrainathlonMenuScreenProps) {
  const { width, height } = useWindowDimensions();
  const lightTitleFontSize = responsiveHeightFontSize(
    height * LIGHT_POPUP_TITLE_FONT_RATIO,
    width,
    height,
    width < 820
  );
  const lightMessageFontSize = responsiveHeightFontSize(
    height * LIGHT_POPUP_MESSAGE_FONT_RATIO,
    width,
    height,
    width < 820
  );
  const lightButtonFontSize = responsiveHeightFontSize(
    height * LIGHT_POPUP_BUTTON_FONT_RATIO,
    width,
    height,
    width < 820
  );
  const lightContentPadding =
    lightMessageFontSize * LIGHT_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO;
  const lightMessageLineHeight =
    lightMessageFontSize * LIGHT_POPUP_MESSAGE_LINE_HEIGHT_RATIO;
  const lightTitleMessageGap =
    lightTitleFontSize * LIGHT_POPUP_TITLE_MESSAGE_GAP_TO_TITLE_FONT_RATIO;
  const lightMessageButtonGap =
    lightMessageFontSize * LIGHT_POPUP_MESSAGE_ACTION_GAP_TO_MESSAGE_FONT_RATIO;
  const lightButtonBorderWidth =
    height * LIGHT_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO;
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [messagePopupHeight, setMessagePopupHeight] = useState(0);
  const messageLanguage = usePopupLanguage(Boolean(playMessage));
  const isBluePlayMessage = bluePlayMessage && Boolean(playMessage);
  const messageCopy = getSystemPopupCopy(messageLanguage.language);
  const localizedPlayMessage = playMessage
    ? localizePlayMessage(playMessage, messageLanguage.language)
    : '';
  const popupMaxWidth = width * (
    width < 820
      ? LIGHT_POPUP_SMALL_MOBILE_MAX_WIDTH_RATIO
      : LIGHT_POPUP_SMALL_LAPTOP_MAX_WIDTH_RATIO
  );
  const popupFrameBorderWidth =
    height * LIGHT_POPUP_FRAME_BORDER_TO_SCREEN_HEIGHT_RATIO;
  const messageButtonLabels = username
    ? [messageCopy.close]
    : [messageCopy.signIn, messageCopy.notNow];
  const messageButtonWidth = getEqualLightPopupButtonWidth(
    messageButtonLabels,
    lightButtonFontSize,
    popupMaxWidth
  );
  const messageButtonHeight = getTranslatedLightPopupButtonHeight(
    lightButtonFontSize,
    width < 768,
    true
  );
  const { language } = usePlayerLanguage();
  const onMenuHover = focusHoveredMenuControl;
  const [guestButtonTextWidth, setGuestButtonTextWidth] = useState(0);
  const isWideLayout = width >= 820;
  const hasFederationAccess = useGreekFederationAccess();
  const menuTitleFontSize = responsiveHeightFontSize(
    height * 0.024, width, height, !isWideLayout
  );
  const menuLearnFontSize = responsiveHeightFontSize(
    height * 0.020, width, height, !isWideLayout
  );
  const menuSubtitleFontSize = responsiveHeightFontSize(
    height * 0.020, width, height, !isWideLayout
  );
  const sectionHeadingMetrics = getMenuSectionHeadingMetrics(width, height, !isWideLayout);
  const menuHeadingFontSize = sectionHeadingMetrics.fontSize;
  const menuLinkFontSize = responsiveHeightFontSize(
    height * 0.014, width, height, !isWideLayout
  );
  const menuCardHeight = (menuTitleFontSize + menuSubtitleFontSize) * 1.80;
  const menuThreeLineHeight = (2 * menuTitleFontSize + menuSubtitleFontSize) * 1.80;
  const menuCardRadius = Math.min(menuCardHeight * 0.24, height * 0.02);
  const menuThreeLineRadius = Math.min(menuThreeLineHeight * 0.24, height * 0.02);
  const menuGap = Math.max(menuTitleFontSize, menuSubtitleFontSize) * 0.35;
  const menuContentWidth = sidebarActive && sidebarWidth
    ? sidebarWidth
    : width * (isWideLayout ? 0.68 : MOBILE_BANNER_WIDTH_RATIO);
  const menuColumnGap = menuHeadingFontSize * 1.40;
  const menuBorderWidth = height * 0.001;
  const menuLogoWidth = width * (isWideLayout ? 0.455 : 0.90);
  const menuCardMetrics = {
    muted: Boolean(sidebarActive),
    titleFontSize: menuTitleFontSize,
    subtitleFontSize: menuSubtitleFontSize,
    cardHeight: menuCardHeight,
    threeLineHeight: menuThreeLineHeight,
    cardRadius: menuCardRadius,
    threeLineRadius: menuThreeLineRadius,
    borderWidth: menuBorderWidth,
  };
  const guestWelcomeVisible = showGuestWelcome && !showFullMenu;
  const guestFontSize = (ratio: number) =>
    responsiveHeightFontSize(height * ratio, width, height, !isWideLayout);
  const guestTaglineFontSize = guestFontSize(0.024);
  const guestSharedDetailFontSize = guestFontSize(0.018);
  const guestCardTitleFontSize = guestFontSize(0.024);
  const guestCardMessageFontSize = guestFontSize(0.020);
  const guestCardButtonFontSize = guestFontSize(0.026);
  const guestViewAllFontSize = guestFontSize(0.024);
  const guestPublicLinkFontSize = guestFontSize(0.014);
  const guestContentWidth = width * (isWideLayout ? 0.68 : 0.90);
  const menuLogoHeight = menuLogoWidth * (239 / 1200);
  const displayedLogoWidth = guestWelcomeVisible ? guestContentWidth : menuLogoWidth;
  const displayedLogoHeight = guestWelcomeVisible
    ? guestContentWidth * (239 / 1200)
    : menuLogoHeight;
  const menuLogoRadius = Math.min(menuLogoHeight * 0.24, height * 0.02);
  const guestOuterTopPadding = height * 0.03;
  const guestOuterBottomPadding = height * 0.04;
  const guestWideCardGap = guestContentWidth * 0.018;
  const guestCardHeight = 5 * guestCardButtonFontSize * 1.80;
  const guestCardPadding = guestCardMessageFontSize;
  const guestBorderWidth = height * 0.001;
  const guestCardRadius = Math.min(
    guestCardHeight * 0.24,
    height * 0.02
  );
  const guestWelcomeButtonWidth = guestButtonTextWidth > 0
    ? guestButtonTextWidth + 2 * guestCardButtonFontSize
    : undefined;
  const measureGuestButtonText = (measuredWidth: number) => {
    setGuestButtonTextWidth(currentWidth =>
      measuredWidth > currentWidth ? measuredWidth : currentWidth
    );
  };
  const guestViewAllHeight = guestViewAllFontSize * 1.80;
  const guestViewAllRadius = Math.min(
    guestViewAllHeight * 0.24,
    height * 0.02
  );

  const comingSoonSection = (
    <View style={[styles.comingSoonSection, {
        width: '100%',
      }]}>
        <Text style={[styles.sectionTitle, {
            fontSize: menuHeadingFontSize,
            lineHeight: sectionHeadingMetrics.lineHeight,
            letterSpacing: sidebarActive ? sectionHeadingMetrics.letterSpacing * 0.82 : sectionHeadingMetrics.letterSpacing,
            ...(sidebarActive ? { color: '#62788e', fontWeight: '700' as const } : {}),
            marginLeft: sectionHeadingMetrics.marginLeft,
            marginTop: getSharedLobbyBannerTitleGap(height),
            marginBottom: getSharedLobbyTitleBannerGap(height),
          }]}>{sidebarActive ? 'Coming Soon' : 'COMING SOON'}</Text>
        <MenuCard
          {...menuCardMetrics}
          title="ADD A DEAL"
          subtitle="Play it. Replay it."
          comingSoon
        />
      </View>
  );

  const brandRow = (
    <View
        style={[
          styles.brandRow,
          !isWideLayout && styles.brandRowMobile,
          !guestWelcomeVisible && {
            width: menuContentWidth,
            maxWidth: undefined,
            marginTop: getSharedLobbyHeadingTopGap(height),
          },
          guestWelcomeVisible && {
            width: guestContentWidth,
            maxWidth: undefined,
            marginBottom: height * 0.050,
          },
        ]}
      >
        <View
          style={[
            { width: displayedLogoWidth, height: displayedLogoHeight },
            !guestWelcomeVisible && {
              borderRadius: menuLogoRadius,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.28,
              shadowRadius: 9,
              elevation: 5,
            },
          ]}
        >
          <Image
            source={require('../../assets/images/leonardo-horizontal.jpg')}
            resizeMode="contain"
            style={[
              { width: '100%', height: '100%' },
              !guestWelcomeVisible && { borderRadius: menuLogoRadius },
            ]}
            accessibilityLabel="Leonardo Bridge"
          />
        </View>
    </View>
  );

  return (
    <ScrollView
      style={sidebarActive ? { flex: 1, width: sidebarWidth } : undefined}
      contentContainerStyle={[
        styles.container,
        (!isWideLayout || sidebarActive) && styles.containerMobile,
        guestWelcomeVisible && styles.guestContainer,
        !guestWelcomeVisible && {
          paddingHorizontal: sidebarActive ? 0 : width * (isWideLayout ? 0.05 : (1 - MOBILE_BANNER_WIDTH_RATIO) / 2),
          paddingTop: 0,
          paddingBottom: height * (isWideLayout ? 0.045 : 0.015),
        },
        guestWelcomeVisible && {
          paddingTop: guestOuterTopPadding,
          paddingBottom: guestOuterBottomPadding,
        },
      ]}
    >
      {(guestWelcomeVisible || !sidebarActive) && brandRow}

      {guestWelcomeVisible ? (
        <View
          style={[
            styles.welcome,
            { width: guestContentWidth, maxWidth: undefined },
          ]}
        >
          <Text
            scaleByDevice={false}
            style={[
              styles.welcomeTagline,
              {
                fontSize: guestTaglineFontSize,
                lineHeight: guestTaglineFontSize * (29 / 22),
                marginBottom: height * 0.016,
                letterSpacing: guestTaglineFontSize * 0.03,
              },
            ]}
          >
            Play bridge. Compare your game.
          </Text>
          <Text
            scaleByDevice={false}
            style={[
              styles.welcomeSharedDetail,
              {
                fontSize: guestSharedDetailFontSize,
                lineHeight: guestSharedDetailFontSize * (21 / 16),
                marginBottom: height * 0.030,
                letterSpacing: guestSharedDetailFontSize * 0.03,
              },
            ]}
          >
            Tournaments, practice and head-to-head Challenges.
          </Text>
          <View style={[
            styles.welcomeCards,
            isWideLayout ? styles.welcomeCardsWide : styles.welcomeCardsMobile,
            {
              gap: isWideLayout
                ? guestWideCardGap
                : guestCardButtonFontSize * 0.35,
            },
          ]}>
            {onTournaments ? (
              <WelcomeCard
                title="TOURNAMENTS"
                message={'Join a Tournament.\nPlay the same deals.\nSee how you compare.'}
                buttonLabel="PLAY A TOURNAMENT"
                onPress={onTournaments}
                titleFontSize={guestCardTitleFontSize}
                messageFontSize={guestCardMessageFontSize}
                buttonFontSize={guestCardButtonFontSize}
                cardHeight={guestCardHeight}
                contentPadding={guestCardPadding}
                borderWidth={guestBorderWidth}
                cardRadius={guestCardRadius}
                buttonWidth={guestWelcomeButtonWidth}
                screenHeight={height}
                onButtonTextWidth={measureGuestButtonText}
                emphasized
              />
            ) : null}
            <WelcomeCard
              title="CHALLENGE"
              message={'Challenge a friend.\nPlay the same deals.\nCompare your scores.'}
              buttonLabel="PLAY A CHALLENGE"
              onPress={onDuel}
              titleFontSize={guestCardTitleFontSize}
              messageFontSize={guestCardMessageFontSize}
              buttonFontSize={guestCardButtonFontSize}
              cardHeight={guestCardHeight}
              contentPadding={guestCardPadding}
              borderWidth={guestBorderWidth}
              cardRadius={guestCardRadius}
              buttonWidth={guestWelcomeButtonWidth}
              screenHeight={height}
              onButtonTextWidth={measureGuestButtonText}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={getInterfaceSpeechCopy(language).viewGames}
            onPress={() => setShowFullMenu(true)}
            style={({ pressed }) => [
              styles.viewAllGamesButton,
              {
                height: guestViewAllHeight,
                marginTop: height * 0.030,
                paddingHorizontal: guestViewAllFontSize,
                borderWidth: guestBorderWidth,
                borderRadius: guestViewAllRadius,
              },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text
              scaleByDevice={false}
              style={[
                styles.viewAllGamesText,
                {
                  fontSize: guestViewAllFontSize,
                  letterSpacing: guestViewAllFontSize * 0.03,
                },
              ]}
            >
              VIEW ALL GAMES
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View
            style={[
              styles.columns,
              isWideLayout && !sidebarActive ? styles.columnsWide : styles.columnsMobile,
              {
                width: menuContentWidth,
                maxWidth: undefined,
                gap: isWideLayout && !sidebarActive ? menuColumnGap : 0,
              },
            ]}
          >
            <View style={[styles.section, (!isWideLayout || sidebarActive) && styles.sectionMobile]}>
              <Text style={[styles.sectionTitle, {
                fontSize: menuHeadingFontSize,
                lineHeight: sectionHeadingMetrics.lineHeight,
                letterSpacing: sidebarActive ? sectionHeadingMetrics.letterSpacing * 0.82 : sectionHeadingMetrics.letterSpacing,
                ...(sidebarActive ? { color: '#62788e', fontWeight: '700' as const } : {}),
                marginLeft: sectionHeadingMetrics.marginLeft,
                marginTop: getSharedLobbyHeadingTopGap(height),
                marginBottom: getSharedLobbyTitleBannerGap(height),
              }]}>{sidebarActive ? 'Play & Compete' : 'PLAY & COMPETE'}</Text>
              <View style={[styles.sectionCards, { gap: menuGap }]}>
                {onTournaments ? (
                  <MenuCard
                    {...menuCardMetrics}
                    selected={sidebarActive === 'tournaments'}
                    activity="tournaments"
                    title="TOURNAMENTS"
                    subtitle="See all tournaments"
                    onPress={onTournaments}
                  />
                ) : null}
                {onOpenTables ? (
                  <MenuCard
                    {...menuCardMetrics}
                    selected={sidebarActive === 'tables'}
                    activity="tables"
                    title="TABLES"
                    subtitle="See or create open table"
                    onPress={onOpenTables}
                  />
                ) : null}
                <MenuCard
                  {...menuCardMetrics}
                  selected={sidebarActive === 'duel'}
                  activity="duel"
                  title="CHALLENGE"
                  subtitle="Challenge another player"
                  onPress={username ? onDuel : onSignIn}
                />
                {onResults ? (
                  <MenuCard
                    {...menuCardMetrics}
                    activity="results"
                    title="RESULTS"
                    subtitle="Results and leaderboard"
                    selected={sidebarActive === 'results'}
                    onPress={onResults}
                  />
                ) : null}
                <MenuCard {...menuCardMetrics} activity="results" title="STATISTICS"
                  subtitle="Your progress"
                  selected={sidebarActive === 'statistics'} onPress={onStatistics} />
              </View>
              {isWideLayout && !sidebarActive ? comingSoonSection : null}
            </View>



            <View style={[styles.section, (!isWideLayout || sidebarActive) && styles.sectionMobile]}>
              <Text style={[styles.sectionTitle, {
                fontSize: menuHeadingFontSize,
                lineHeight: sectionHeadingMetrics.lineHeight,
                letterSpacing: sidebarActive ? sectionHeadingMetrics.letterSpacing * 0.82 : sectionHeadingMetrics.letterSpacing,
                ...(sidebarActive ? { color: '#62788e', fontWeight: '700' as const } : {}),
                marginLeft: sectionHeadingMetrics.marginLeft,
                marginTop: getSharedLobbyHeadingTopGap(height),
                marginBottom: getSharedLobbyTitleBannerGap(height),
              }]}>{sidebarActive ? 'Practice & Improve' : 'PRACTICE & IMPROVE'}</Text>
              <View style={[styles.sectionCards, { gap: menuGap }]}>
                <MenuCard
                  {...menuCardMetrics}
                  activity="practice"
                  menuKey={PRACTICE_MENU_TITLE}
                  title="SOLO PRACTICE"
                  subtitle="Relaxed play — no ranking"
                  selected={sidebarActive === 'solo-practice'}
                  onPress={onPractice}
                />
                <MenuCard
                  {...menuCardMetrics}
                  activity="practice"
                  title="PARTNERSHIP PRACTICE"
                  subtitle="Practice with a partner"
                  selected={sidebarActive === 'partnership-practice'}
                  onPress={onPartnershipPractice}
                />
                <MenuCard
                  {...menuCardMetrics}
                  activity="practice"
                  title={TEACHING_PLACE_TITLE}
                  subtitle="Teachers only"
                  accessibilityLabel={getTeachingTableCopy(language).title + '. ' + getTeachingTableCopy(language).teachersOnly}
                  selected={sidebarActive === 'teaching-table'}
                  onPress={onTeachingTable}
                />
              </View>

            {hasFederationAccess ? (
              <View style={[styles.comingSoonSection]}>
                <Text style={[styles.sectionTitle, {
                fontSize: menuHeadingFontSize,
                lineHeight: sectionHeadingMetrics.lineHeight,
                letterSpacing: sidebarActive ? sectionHeadingMetrics.letterSpacing * 0.82 : sectionHeadingMetrics.letterSpacing,
                ...(sidebarActive ? { color: '#62788e', fontWeight: '700' as const } : {}),
                marginLeft: sectionHeadingMetrics.marginLeft,
                marginTop: getSharedLobbyBannerTitleGap(height),
                marginBottom: getSharedLobbyTitleBannerGap(height),
              }]}>{sidebarActive ? 'Real Deals' : 'REAL DEALS'}</Text>
                <View style={[styles.sectionCards, { gap: menuGap }]}>
                  <MenuCard
                    {...menuCardMetrics}
                    selected={sidebarActive === 'federation'}
                    activity="federation"
                    menuKey="federation"
                    title={sidebarActive || !isWideLayout ? 'ΕΟΜ' : 'ΕΛΛΗΝΙΚΗ ΟΜΟΣΠΟΝΔΙΑ ΜΠΡΙΤΖ'}
                    subtitle={
                      federationDealsEnabled
                        ? 'Replay official tournament deals'
                        : 'NOT YET'
                    }
                    onPress={
                      federationDealsEnabled
                        ? onFederationDeals
                        : undefined
                    }
                    comingSoon={!federationDealsEnabled}
                  />
                </View>
              </View>
            ) : null}
              <View style={[styles.comingSoonSection, {
                width: '100%',
              }]}>
                <Text style={[styles.sectionTitle, {
                  fontSize: menuHeadingFontSize,
                  lineHeight: sectionHeadingMetrics.lineHeight,
                  letterSpacing: sidebarActive
                    ? sectionHeadingMetrics.letterSpacing * 0.82
                    : sectionHeadingMetrics.letterSpacing,
                  ...(sidebarActive ? { color: '#62788e', fontWeight: '700' as const } : {}),
                  marginLeft: sectionHeadingMetrics.marginLeft,
                  marginTop: getSharedLobbyBannerTitleGap(height),
                  marginBottom: getSharedLobbyTitleBannerGap(height),
                }]}>
                  {sidebarActive ? 'Learn' : 'LEARN'}{' '}<Text aria-hidden accessibilityElementsHidden importantForAccessibility="no">📖</Text>
                </Text>
                <View style={{ marginLeft: sectionHeadingMetrics.marginLeft }}>
                <Link href="https://leonardobridge.com/how-leonardo-defends" asChild>
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel={menuControlName('/how-leonardo-defends', language)} ref={node => applyMenuHoverText(node, '/how-leonardo-defends')}
                  onHoverIn={onMenuHover} onPress={recordMenuNavigation}
                  style={({ pressed }) => [
                    styles.learnLink,
                    {
                      minHeight: menuLearnFontSize * 1.60,
                      gap: menuLearnFontSize * 0.35,
                                      },
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={[styles.learnLinkText, {
                    fontSize: menuLearnFontSize,
                    lineHeight: menuLearnFontSize * 1.60,
                  }]}>
                    How Leonardo Defends
                  </Text>
                </Pressable>
                </Link>
                <Link href="/" asChild>
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel={menuControlName('/conventions', language)} ref={node => applyMenuHoverText(node, '/conventions')}
                    onHoverIn={onMenuHover} onPress={recordMenuNavigation}
                    style={({ pressed }) => [
                      styles.learnLink,
                      {
                        minHeight: menuLearnFontSize * 1.60,
                                            marginTop: menuGap,
                      },
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={[styles.learnLinkText, {
                      fontSize: menuLearnFontSize,
                      lineHeight: menuLearnFontSize * 1.60,
                    }]}>Conventions</Text>
                  </Pressable>
                </Link>
            </View>
          </View>

            </View>
            {!isWideLayout || sidebarActive ? comingSoonSection : null}
          </View>


        </>
      )}

      {!sidebarActive && <View
        style={[
          styles.publicLinks,
          {
            gap: guestWelcomeVisible ? guestPublicLinkFontSize : menuLinkFontSize,
            marginTop: 'auto',
            paddingTop: height * 0.05,
          },
        ]}
      >
        <Link href="https://leonardobridge.com/how-it-works" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel={menuControlName('/how-it-works', language)} ref={node => applyMenuHoverText(node, '/how-it-works')} onHoverIn={onMenuHover} onPress={recordMenuNavigation} style={({ pressed }) => [
            styles.publicLink,
            !guestWelcomeVisible && {
              minHeight: menuLinkFontSize * 1.60,
              paddingHorizontal: menuLinkFontSize,
            },
            guestWelcomeVisible && {
              height: guestPublicLinkFontSize * 1.80,
              minHeight: undefined,
              paddingHorizontal: guestPublicLinkFontSize,
            },
            pressed && styles.buttonPressed,
          ]}>
            <Text
              scaleByDevice={!guestWelcomeVisible}
              style={[
                styles.publicLinkText,
                !guestWelcomeVisible && {
                  fontSize: menuLinkFontSize,
                  letterSpacing: menuLinkFontSize * (0.8 / 11),
                },
                guestWelcomeVisible && styles.guestPublicLinkText,
                guestWelcomeVisible && {
                  fontSize: guestPublicLinkFontSize,
                  letterSpacing: guestPublicLinkFontSize * 0.03,
                },
              ]}
            >
              About Leonardo Bridge
            </Text>
          </Pressable>
        </Link>
        <Link href="https://leonardobridge.com/privacy-policy" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel={menuControlName('/privacy-policy', language)} ref={node => applyMenuHoverText(node, '/privacy-policy')} onHoverIn={onMenuHover} onPress={recordMenuNavigation} style={({ pressed }) => [
            styles.publicLink,
            !guestWelcomeVisible && {
              minHeight: menuLinkFontSize * 1.60,
              paddingHorizontal: menuLinkFontSize,
            },
            guestWelcomeVisible && {
              height: guestPublicLinkFontSize * 1.80,
              minHeight: undefined,
              paddingHorizontal: guestPublicLinkFontSize,
            },
            pressed && styles.buttonPressed,
          ]}>
            <Text
              scaleByDevice={!guestWelcomeVisible}
              style={[
                styles.publicLinkText,
                !guestWelcomeVisible && {
                  fontSize: menuLinkFontSize,
                  letterSpacing: menuLinkFontSize * (0.8 / 11),
                },
                guestWelcomeVisible && styles.guestPublicLinkText,
                guestWelcomeVisible && {
                  fontSize: guestPublicLinkFontSize,
                  letterSpacing: guestPublicLinkFontSize * 0.03,
                },
              ]}
            >
              Privacy policy
            </Text>
          </Pressable>
        </Link>
        <Link href="https://leonardobridge.com/terms-of-use" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel={menuControlName('/terms-of-use', language)} ref={node => applyMenuHoverText(node, '/terms-of-use')} onHoverIn={onMenuHover} onPress={recordMenuNavigation} style={({ pressed }) => [
            styles.publicLink,
            !guestWelcomeVisible && {
              minHeight: menuLinkFontSize * 1.60,
              paddingHorizontal: menuLinkFontSize,
            },
            guestWelcomeVisible && {
              height: guestPublicLinkFontSize * 1.80,
              minHeight: undefined,
              paddingHorizontal: guestPublicLinkFontSize,
            },
            pressed && styles.buttonPressed,
          ]}>
            <Text
              scaleByDevice={!guestWelcomeVisible}
              style={[
                styles.publicLinkText,
                !guestWelcomeVisible && {
                  fontSize: menuLinkFontSize,
                  letterSpacing: menuLinkFontSize * (0.8 / 11),
                },
                guestWelcomeVisible && styles.guestPublicLinkText,
                guestWelcomeVisible && {
                  fontSize: guestPublicLinkFontSize,
                  letterSpacing: guestPublicLinkFontSize * 0.03,
                },
              ]}
            >
              Terms of use
            </Text>
          </Pressable>
        </Link>
      </View>}

      <AppOverlay
        animationType="fade"
        transparent
        visible={Boolean(playMessage)}
        onRequestClose={onDismissMessage}
      >
        <View style={[styles.lightMessageOverlay, { padding: lightContentPadding }]}>
          <View
            accessibilityRole="alert"
            onLayout={event => setMessagePopupHeight(event.nativeEvent.layout.height)}
            style={[
              styles.lightMessageCard,
              isBluePlayMessage && {
                borderColor: BLUE_POPUP_FRAME_BORDER_COLOR,
                backgroundColor: BLUE_POPUP_FRAME_BACKGROUND_COLOR,
              },
              {
                maxWidth: popupMaxWidth,
                padding: lightContentPadding,
                borderWidth: popupFrameBorderWidth,
                borderRadius: getLightPopupFrameRadius(messagePopupHeight, height),
              },
            ]}
          >
            <PopupLanguageControl
              showEnglish={messageLanguage.showEnglish}
              playerLanguage={messageLanguage.playerLanguage}
              variant={isBluePlayMessage ? 'blue' : 'light'}
              onClose={onDismissMessage}
              onPress={messageLanguage.toggleLanguage}
            />
            <Text
              scaleByDevice={false}
              style={[
                styles.lightMessageTitle,
                isBluePlayMessage && { color: BLUE_POPUP_TITLE_COLOR },
                {
                  fontSize: lightTitleFontSize,
                  letterSpacing:
                    lightTitleFontSize * LIGHT_POPUP_TITLE_LETTER_SPACING_TO_FONT_RATIO,
                },
              ]}
            >
              {messageCopy.attention}
            </Text>
            <Text
              scaleByDevice={false}
              style={[
                styles.lightPlayMessage,
                isBluePlayMessage && { color: BLUE_POPUP_MESSAGE_COLOR },
                {
                  fontSize: lightMessageFontSize,
                  lineHeight: lightMessageLineHeight,
                  marginTop: lightTitleMessageGap,
                },
              ]}
            >
              {localizedPlayMessage}
            </Text>
            <View style={[styles.popupActions, { gap: lightButtonFontSize * 0.35, marginTop: lightMessageButtonGap, flexDirection: isWideLayout ? 'row' : 'column' }]}>
              {username ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={messageCopy.close}
                  onPress={onDismissMessage}
                  style={({ pressed }) => [
                    styles.lightMessageCloseButton,
                    styles.popupSecondaryButton,
                    isBluePlayMessage && {
                      borderColor: BLUE_POPUP_BUTTON_BORDER_COLOR,
                      backgroundColor: BLUE_POPUP_FRAME_BACKGROUND_COLOR,
                    },
                    {
                      width: messageButtonWidth,
                      height: messageButtonHeight,
                      borderWidth: lightButtonBorderWidth,
                      borderRadius: messageButtonHeight * LIGHT_POPUP_BUTTON_RADIUS_TO_HEIGHT_RATIO,
                    },
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text scaleByDevice={false} style={[styles.lightMessageCloseButtonText, isBluePlayMessage && { color: BLUE_POPUP_BUTTON_COLOR }, {
                        fontSize: lightButtonFontSize,
                        letterSpacing:
                          lightButtonFontSize * LIGHT_POPUP_BUTTON_LETTER_SPACING_TO_FONT_RATIO,
                      }]}>
                    {messageCopy.close}
                  </Text>
                </Pressable>
              ) : (
                <>
                  <Pressable
                    onPress={onSignIn}
                    style={({ pressed }) => [
                      styles.lightMessageCloseButton,
                      styles.popupPrimaryButton,
                      isBluePlayMessage && {
                        borderColor: BLUE_POPUP_BUTTON_BORDER_COLOR,
                        backgroundColor: BLUE_POPUP_BUTTON_BACKGROUND_COLOR,
                      },
                      {
                        width: messageButtonWidth,
                        height: messageButtonHeight,
                        borderWidth: lightButtonBorderWidth,
                        borderRadius: messageButtonHeight * LIGHT_POPUP_BUTTON_RADIUS_TO_HEIGHT_RATIO,
                      },
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text scaleByDevice={false} style={[styles.lightMessageCloseButtonText, isBluePlayMessage && { color: BLUE_POPUP_BUTTON_COLOR }, {
                        fontSize: lightButtonFontSize,
                        letterSpacing:
                          lightButtonFontSize * LIGHT_POPUP_BUTTON_LETTER_SPACING_TO_FONT_RATIO,
                      }]}>
                      {messageCopy.signIn}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={onDismissMessage}
                    style={({ pressed }) => [
                      styles.lightMessageCloseButton,
                      styles.popupSecondaryButton,
                    isBluePlayMessage && {
                      borderColor: BLUE_POPUP_BUTTON_BORDER_COLOR,
                      backgroundColor: BLUE_POPUP_FRAME_BACKGROUND_COLOR,
                    },
                      {
                        width: messageButtonWidth,
                        height: messageButtonHeight,
                        borderWidth: lightButtonBorderWidth,
                        borderRadius: messageButtonHeight * LIGHT_POPUP_BUTTON_RADIUS_TO_HEIGHT_RATIO,
                      },
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text scaleByDevice={false} style={[styles.lightMessageCloseButtonText, isBluePlayMessage && { color: BLUE_POPUP_BUTTON_COLOR }, {
                        fontSize: lightButtonFontSize,
                        letterSpacing:
                          lightButtonFontSize * LIGHT_POPUP_BUTTON_LETTER_SPACING_TO_FONT_RATIO,
                      }]}>
                      {messageCopy.notNow}
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      </AppOverlay>
    </ScrollView>
  );
}

const MESSAGE_FONT_SIZE = 18;
const messageCloseFontSize = deviceScaledSize(MESSAGE_FONT_SIZE);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: '100%',
    alignItems: 'center',
    backgroundColor: '#faf4ee',
  },
  guestContainer: {
    backgroundColor: '#faf4ee',
  },
  brandRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerMobile: {
    justifyContent: 'flex-start',
  },
  brandRowMobile: {},
  welcome: {
    width: '100%',
    maxWidth: 980,
    alignItems: 'center',
  },
  welcomeTagline: {
    color: '#0a3c6a',
    fontWeight: '800',
    textAlign: 'center',
  },
  welcomeSharedDetail: {
    color: '#4b7198',
    textAlign: 'center',
  },
  welcomeCards: {
    width: '100%',
  },
  welcomeCardsWide: {
    flexDirection: 'row',
  },
  welcomeCardsMobile: {
    flexDirection: 'column',
  },
  welcomeCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: '#4b7198',
    backgroundColor: '#dde7f1',
  },
  welcomeCardEmphasized: {
    borderColor: '#4b7198',
    backgroundColor: '#dde7f1',
  },
  welcomeCardTitle: {
    color: '#0a3c6a',
    fontWeight: '900',
    textAlign: 'center',
  },
  welcomeCardMessage: {
    color: '#0a3c6a',
    fontWeight: '700',
    textAlign: 'center',
  },
  welcomeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: '#0a3c6a',
    backgroundColor: '#edf3f8',
  },
  welcomeButtonEmphasized: {
    backgroundColor: '#edf3f8',
  },
  welcomeButtonText: {
    color: '#0a3c6a',
    fontWeight: '900',
    textAlign: 'center',
  },
  welcomeButtonTextEmphasized: {
    color: '#0a3c6a',
  },
  viewAllGamesButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#4b7198',
  },
  viewAllGamesText: {
    color: '#0a3c6a',
    fontWeight: '900',
    textAlign: 'center',
  },
  section: {
    flex: 1,
    width: '100%',
  },
  sectionMobile: {
    flex: 0,
    flexBasis: 'auto',
    width: '100%',
  },
  sectionTitle: {
    color: '#0a3c6a',
    fontWeight: '700',
  },
  sectionCards: {
    width: '100%',
  },
  comingSoonSection: {
    width: '100%',
  },
  columns: {
    width: '100%',
  },
  columnsWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  columnsMobile: {},
  menuCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#4b7198',
    backgroundColor: MENU_CATEGORY_COLORS.play,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 9,
    elevation: 5,
  },
  menuCardUnavailable: {
    borderColor: '#8a98a8',
    backgroundColor: '#d6dce2',
    shadowOpacity: 0.08,
    elevation: 1,
  },
  menuCardComingSoon: {
    borderColor: '#8a98a8',
    backgroundColor: MENU_CATEGORY_COLORS.comingSoon,
  },
  menuCardText: {
    flex: 1,
  },
  menuCardTitle: {
    color: '#0a3c6a',
    fontWeight: '900',
  },
  menuCardTitleComingSoon: {
    color: '#697789',
  },
  menuCardTitleUnavailable: {
    color: '#697789',
  },
  menuCardSubtitle: {
    color: '#4b7198',
  },
  menuCardSubtitleComingSoon: {
    color: '#7a8796',
  },
  menuCardSubtitleUnavailable: {
    color: '#7a8796',
  },
  learnLink: { flexDirection: 'row', alignItems: 'center' },
  learnLinkText: { color: '#0a3c6a', fontWeight: '800', textDecorationLine: 'underline', flexShrink: 1 },
  publicLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  publicLink: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  publicLinkText: {
    color: '#777777',
    fontWeight: '800',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  guestPublicLinkText: {
    color: '#777777',
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  messageOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    padding: 24,
  },
  lightMessageOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.60)',
  },
  messageCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4b7198',
    borderRadius: 18,
    backgroundColor: '#dde7f1',
    padding: 24,
  },
  lightMessageCard: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: LIGHT_POPUP_FRAME_BORDER_COLOR,
    backgroundColor: LIGHT_POPUP_FRAME_BACKGROUND_COLOR,
  },
  messageClose: {
    position: 'absolute',
    top: messageCloseFontSize * 0.35,
    right: messageCloseFontSize * 0.35,
    width: messageCloseFontSize * 2.5,
    height: messageCloseFontSize * 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  messageCloseText: {
    color: '#0a3c6a',
    fontSize: messageCloseFontSize,
    fontWeight: '700',
    textAlign: 'center',
  },
  playMessage: {
    color: '#0a3c6a',
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  lightMessageTitle: {
    color: LIGHT_POPUP_TITLE_COLOR,
    fontWeight: '900',
    textAlign: 'center',
  },
  lightPlayMessage: {
    color: LIGHT_POPUP_MESSAGE_COLOR,
    textAlign: 'center',
  },
  popupActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupPrimaryButton: {
    borderColor: LIGHT_POPUP_PRIMARY_BUTTON_BORDER_COLOR,
    backgroundColor: LIGHT_POPUP_PRIMARY_BUTTON_BACKGROUND_COLOR,
  },
  popupSecondaryButton: {
    borderColor: LIGHT_POPUP_SECONDARY_BUTTON_BORDER_COLOR,
    backgroundColor: LIGHT_POPUP_SECONDARY_BUTTON_BACKGROUND_COLOR,
  },
  lightMessageCloseButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightMessageCloseButtonText: {
    color: LIGHT_POPUP_BUTTON_COLOR,
    fontWeight: '900',
    textAlign: 'center',
  },
  messagePrimaryButton: {
    justifyContent: 'center',
    height: textFrameHeight(15),
    width: '100%',
    maxWidth: 260,
    marginTop: 22,
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#edf3f8',
    
  },
  messagePrimaryText: {
    color: '#0a3c6a',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  messageSecondaryButton: {
    justifyContent: 'center',
    height: textFrameHeight(13),
    marginTop: 10,
    paddingHorizontal: 20,
    
  },
  messageSecondaryText: {
    color: '#0a3c6a',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

