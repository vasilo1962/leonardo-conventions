import { TableInvitationHeader } from '@/features/table-invitations/ui';
import AccountMenuRow, { accountMenuFontSize, MenuGlyph } from '@/components/account-menu-row';
import { getAccountSignOutLabel, getAccountTitleLabel } from '@/lib/account-menu-translations';
import useInfoMessageReading from '@/shared/accessibility/use-info-message-reading';
import * as blue from '@/lib/blue-popup-style';
import { LIGHT_POPUP_FRAME_BACKGROUND_COLOR } from '@/lib/light-popup-style';
import { useFriends } from '@/features/friends/provider';
import { getFriendCopy } from '@/features/friends/copy';
import { FriendsMenuEntry, FriendsPanel } from '@/features/friends/ui';
import CustomizeSettings from '@/components/customize-settings';
import { getCustomizeCopy } from '@/lib/customize-translations';
import AccountDeletionControl from '@/components/account-deletion-control';
import { readPageHelpSnapshot } from '@/shared/help/page-snapshot';
import { interfaceSpeech } from '@/shared/accessibility/interface-speech-translations';
import { getGamePopupCopy } from '@/lib/game-popup-translations';
import { getSystemPopupCopy } from '@/lib/system-popup-translations';
import { focusHoveredMenuControl } from '@/shared/accessibility/menu-hover-focus';
import { useVoiceMode } from '@/shared/accessibility/voice-mode';
import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Text as NativeText,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';


import AppOverlay from '@/components/app-overlay';
import HeaderLanguageControl from '@/components/header-language-control';
import usePlayerLanguage from '@/hooks/use-player-language';
import Text from '@/components/app-text';
import AiHelpDialog from '@/components/ai-help-dialog';
import { getAuthCopy } from '@/lib/auth-translations';
import type {
  HelpAction,
  HelpContext,
} from '@/lib/ai-help';
import {
  responsiveHeightFontSize,
} from '@/lib/interface-scale';
import {
  type InfoLanguage,
} from '@/lib/info-popup-translations';

export const APP_HEADER_TOP = 14;
export const APP_HEADER_HEIGHT_SHARE = 0.026;
const APP_HEADER_FONT_TO_HEIGHT_RATIO = 0.72;

const NEED_HELP_COPY: Record<InfoLanguage, string> = {
  en: 'need help?',
  fr: 'besoin d’aide ?',
  nl: 'hulp nodig?',
  zh: '需要帮助吗？',
  it: 'serve aiuto?',
  de: 'Hilfe nötig?',
  sv: 'behöver du hjälp?',
  da: 'brug for hjælp?',
  no: 'trenger du hjelp?',
  pl: 'potrzebujesz pomocy?',
  ja: 'ヘルプが必要ですか？',
  he: 'צריך עזרה?',
  es: '¿necesitas ayuda?',
  pt: 'precisa de ajuda?',
  hi: 'मदद चाहिए?',
  tr: 'yardım lazım mı?',
  ru: 'нужна помощь?',
  el: 'χρειάζεσαι βοήθεια;',
  fi: 'tarvitsetko apua?',
  cs: 'potřebujete pomoc?',
  is: 'þarftu hjálp?',
  hu: 'segítség kell?',
  id: 'perlu bantuan?',
  ar: 'هل تحتاج إلى مساعدة؟',
  th: 'ต้องการความช่วยเหลือไหม?',
  ko: '도움이 필요하세요?',
};

type AppHeaderProps = {
  username: string;
  menuHoverAccessibility?: boolean;
  onAccountMenuVisibleChange?: (visible: boolean) => void;
  onExit?: () => void;
  onSignOut?: () => void;
  onSaveProgress?: () => void;
  isGuest?: boolean;
  showGuestUsername?: boolean;
  signOutBusy?: boolean;
  helpContext?: HelpContext;
  onHelpNavigate?: (action: HelpAction) => void;
  onHelpPress?: () => void;
  lightTheme?: boolean;
};

export default function AppHeader({
  username,
  menuHoverAccessibility = false,
  onAccountMenuVisibleChange,
  onExit,
  onSignOut,
  onSaveProgress,
  isGuest = false,
  showGuestUsername = false,
  signOutBusy = false,
  helpContext,
  onHelpNavigate,
  onHelpPress,
  lightTheme = false,
}: AppHeaderProps) {
  const voiceMode = useVoiceMode();
  const { width, height } = useWindowDimensions();
  const headerHeight = height * APP_HEADER_HEIGHT_SHARE;
  const headerFontSize = responsiveHeightFontSize(
    headerHeight * APP_HEADER_FONT_TO_HEIGHT_RATIO,
    width,
    height,
    width < 768
  );
  const displayFontSize = isGuest ? Math.min(headerFontSize, width * 0.034) : headerFontSize;
  const accountButtonRef = useRef<View>(null);
  const menuRef = useRef<View>(null);
  const menuNameRef = useRef<unknown>(null);
  const opening = useRef(0);
  const [accountAnchor, setAccountAnchor] = useState<{ right: number; top: number } | null>(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuFont = accountMenuFontSize(width, height);
  const mobileMenu = width < 768;
  const [accountVisible, setAccountVisible] = useState(false);
  const friends = useFriends();
  const ownsFriends = useRef(false);
  const [customizeReadOnOpen, setCustomizeReadOnOpen] = useState(false);
  const [accountPanel, setAccountPanel] = useState<'menu' | 'customize' | 'friends'>('menu');
  const customizeVisible = accountPanel === 'customize';
  const friendsVisible = accountPanel === 'friends' && Boolean(friends?.enabled && friends.open);
  const [accountScope, setAccountScope] = useState(voiceMode.sessionScope);
  if (accountScope !== voiceMode.sessionScope
    || (accountPanel === 'friends' && !friends?.open)) {
    setAccountScope(voiceMode.sessionScope);
    setAccountVisible(false);
    setAccountPanel('menu');
  }
  const [helpVisible, setHelpVisible] = useState(false);
  const { language: playerLanguage } = usePlayerLanguage();
  const onMenuHover = menuHoverAccessibility ? focusHoveredMenuControl : undefined;
  const needHelp = NEED_HELP_COPY[playerLanguage];
  const accountTitle = customizeVisible ? getCustomizeCopy(playerLanguage).title
    : friendsVisible ? getFriendCopy(playerLanguage).title : getAccountTitleLabel(playerLanguage);
  const accountTitleFont = responsiveHeightFontSize(height * blue.BLUE_POPUP_TITLE_FONT_RATIO, width, height, mobileMenu);
  const accountLabel = `${getAuthCopy(playerLanguage).signIn} / ${getAuthCopy(playerLanguage).signUp}`;

  useLayoutEffect(() => {
    onAccountMenuVisibleChange?.(accountVisible);
    return () => onAccountMenuVisibleChange?.(false);
  }, [accountVisible, onAccountMenuVisibleChange]);

  function closeAccount() {
    opening.current += 1;
    setAccountVisible(false);
    setAccountPanel('menu');
    if (ownsFriends.current) { ownsFriends.current = false; friends?.setOpen(false); }
  }

  function dismissAccount() {
    closeAccount();
    accountButtonRef.current?.focus();
  }

  function openAccount(showFriends = false) {
    if (accountVisible && !showFriends) { closeAccount(); return; }
    setAccountPanel(showFriends ? 'friends' : 'menu');
    if (showFriends && friends?.enabled) {
      ownsFriends.current = true; friends.setOpen(true); void friends.refresh();
    }
    if (mobileMenu) { setAccountVisible(true); return; }
    const request = ++opening.current;
    accountButtonRef.current?.measureInWindow((x, y, buttonWidth, buttonHeight) => {
      if (request !== opening.current) return;
      setAccountAnchor({ right: width - x - buttonWidth, top: y + buttonHeight });
      setAccountVisible(true);
    });
  }

  useLayoutEffect(() => {
    opening.current += 1;
    if (!accountVisible || mobileMenu) return;
    const request = opening.current;
    accountButtonRef.current?.measureInWindow((x, y, buttonWidth, buttonHeight) => {
      if (request === opening.current) setAccountAnchor({ right: width - x - buttonWidth, top: y + buttonHeight });
    });
  }, [width, height, accountVisible, mobileMenu, voiceMode.sessionScope]);
  useEffect(() => () => { opening.current += 1; }, [voiceMode.sessionScope]);
  const setFriendsOpen = friends?.setOpen;
  useEffect(() => () => {
    if (ownsFriends.current) { ownsFriends.current = false; setFriendsOpen?.(false); }
  }, [setFriendsOpen]);
  useEffect(() => {
    if (!friends?.open) ownsFriends.current = false;
  }, [friends?.open]);
  const openFriendsFromLink = useEffectEvent(() => openAccount(true));
  useEffect(() => {
    if (!friends?.enabled || typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('friends') !== '1') return;
    // The shortcut needs the committed header layout before measuring its anchor.
    const frame = window.requestAnimationFrame(() => {
      const currentUrl = new URL(window.location.href);
      if (currentUrl.searchParams.get('friends') !== '1') return;
      currentUrl.searchParams.delete('friends');
      window.history.replaceState(window.history.state, '', currentUrl.pathname + currentUrl.search + currentUrl.hash);
      openFriendsFromLink();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [friends?.enabled, voiceMode.sessionScope]);
  useInfoMessageReading(menuNameRef, accountVisible, customizeVisible ? customizeReadOnOpen : voiceMode.enabled,
    accountTitle, playerLanguage);
  useEffect(() => {
    if (!accountVisible || accountPanel !== 'menu' || typeof document === 'undefined') return;
    const keydown = (event: KeyboardEvent) => {
      if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
      const menu = menuRef.current as unknown as HTMLElement | null;
      const trigger = accountButtonRef.current as unknown as HTMLElement | null;
      if (!menu || (!menu.contains(document.activeElement) && document.activeElement !== trigger)) return;
      const rows = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'))
        .filter(row => row.getAttribute('aria-disabled') !== 'true');
      if (!rows.length) return;
      const index = rows.indexOf(document.activeElement as HTMLElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1
        : event.key === 'ArrowDown' ? (index + 1) % rows.length : (index < 0 ? rows.length - 1 : (index + rows.length - 1) % rows.length);
      event.preventDefault(); rows[next].focus();
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [accountVisible, accountPanel]);

  function closeAccountAndRun(action?: () => void) {
    closeAccount();
    action?.();
  }

  return (
    <>
      <View pointerEvents="box-none" style={[styles.header, { height: headerHeight }]}>
        <View style={styles.left}>
          {onExit ? (
            <Pressable
              accessibilityRole="button"
            onHoverIn={onMenuHover}
              accessibilityLanguage={playerLanguage}
              accessibilityLabel={getGamePopupCopy(playerLanguage).exit}
              onPress={onExit}
              style={({ pressed }) => [
                styles.headerAction,
                pressed && styles.pressed,
              ]}
            >
              <Text
                scaleByDevice={false}
                style={[
                  styles.exitText,
                  lightTheme && styles.lightExitText,
                  {
                    fontSize: displayFontSize,
                    lineHeight: headerHeight,
                    transform: [{ translateY: -headerHeight * 0.08 }],
                  },
                ]}
              >
                ← Exit
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.right}>
          <TableInvitationHeader fontSize={displayFontSize} height={headerHeight} />
          {voiceMode.ready && !voiceMode.screenReader ? <Pressable
            testID="voice-mode-toggle"
            accessibilityRole="switch"
            onHoverIn={onMenuHover}
            accessibilityLanguage={playerLanguage}
            accessibilityLabel={interfaceSpeech('voiceMode', playerLanguage)}
            aria-checked={voiceMode.enabled}
            accessibilityState={{ checked: voiceMode.enabled, disabled: !voiceMode.ready || voiceMode.saving }}
            disabled={!voiceMode.ready || voiceMode.saving}
            onPress={voiceMode.toggle}
            style={[styles.headerAction, { width: headerHeight, marginRight: displayFontSize * 0.35 }]}
          >
            {Platform.OS === 'web' ? (
              <svg
                aria-hidden="true"
                focusable="false"
                width={headerHeight}
                height={headerHeight}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0a3c6a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5 6 9H3v6h3l5 4Z" />
                {voiceMode.enabled ? (
                  <path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" />
                ) : (
                  <path d="m16 9 5 6m0-6-5 6" />
                )}
              </svg>
            ) : (
              <Text
                accessible={false}
                scaleByDevice={false}
                style={{ fontSize: headerHeight, lineHeight: headerHeight }}
              >
                {voiceMode.enabled ? '🔊' : '🔇'}
              </Text>
            )}
          </Pressable> : null}
          {isGuest && !showGuestUsername && onSaveProgress ? (
            <Pressable
              accessibilityRole="button"
            onHoverIn={onMenuHover}
              accessibilityLanguage={playerLanguage}
              accessibilityLabel={accountLabel}
              onPress={onSaveProgress}
              style={({ pressed }) => [
                styles.signUpButton,
                { marginRight: displayFontSize * 0.35 },
                pressed && styles.pressed,
              ]}
            >
              <Text
                numberOfLines={1}
                scaleByDevice={false}
                style={[
                  styles.signUpText,
                  lightTheme && styles.lightHelpText,
                  {
                    fontSize: displayFontSize,
                    lineHeight: headerHeight,
                    transform: [{ translateY: -headerHeight * 0.08 }],
                  },
                ]}
              >
                LOG IN / SIGN UP
              </Text>
            </Pressable>
          ) : null}

          {!isGuest || showGuestUsername ? <Pressable
            ref={accountButtonRef}
            testID="account-menu-open"
            accessibilityRole="button"
            onHoverIn={onMenuHover}
            accessibilityLanguage={playerLanguage}
            accessibilityLabel={isGuest ? accountLabel : interfaceSpeech('playerMenu', playerLanguage, {name: username ?? ''})}
            onPress={isGuest ? onSaveProgress : () => openAccount()}
            style={({ pressed }) => [
              styles.usernameButton,
              pressed && styles.pressed,
            ]}
          >
            <Text
              numberOfLines={1}
              scaleByDevice={false}
              style={[
                styles.username,
                lightTheme && styles.lightUsername,
                {
                    fontSize: displayFontSize,
                    lineHeight: headerHeight,
                    transform: [{ translateY: -headerHeight * 0.08 }],
                  },
              ]}
            >
              {`${username},\u00a0`}
            </Text>
          </Pressable> : null}

          <Pressable
            accessibilityRole="button"
            onHoverIn={onMenuHover}
            accessibilityLanguage={playerLanguage}
            accessibilityLabel={needHelp}
            onPress={onHelpPress ?? (() => setHelpVisible(true))}
            style={({ pressed }) => [
              styles.helpButton,
              pressed && styles.pressed,
            ]}
          >
            <Text
              numberOfLines={1}
              scaleByDevice={false}
              style={[
                styles.helpText,
                lightTheme && styles.lightHelpText,
                {
                    fontSize: displayFontSize,
                    lineHeight: headerHeight,
                    transform: [{ translateY: -headerHeight * 0.08 }],
                  },
              ]}
            >
              {needHelp}
            </Text>
          </Pressable>
          <HeaderLanguageControl size={headerHeight} gap={displayFontSize * 0.35}
            fontSize={displayFontSize} onMenuHover={onMenuHover} />
        </View>
      </View>

      <AppOverlay animationType="fade" transparent fixedToViewport visible={accountVisible}
        announceContent={false} readPrimaryAction={false} onRequestClose={dismissAccount}>
        <Pressable testID="account-menu-backdrop" accessible={false} {...{ tabIndex: -1 as const }} onPress={dismissAccount}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'transparent', padding: menuFont }}>
          {mobileMenu || accountAnchor ? <Pressable ref={menuRef} testID="account-menu-card"
            accessibilityRole={accountPanel === 'menu' ? 'menu' : undefined} role={accountPanel === 'menu' ? undefined : 'dialog'}
            aria-modal={accountPanel !== 'menu' || undefined} accessibilityLanguage={playerLanguage} {...{ lang: playerLanguage }}
            accessibilityLabel={accountTitle}
            {...(Platform.OS === 'web' ? { onKeyDownCapture: (event: {
              key: string; preventDefault: () => void; stopPropagation: () => void;
            }) => {
              if (event.key !== 'Escape') return;
              event.preventDefault();
              event.stopPropagation();
              dismissAccount();
            } } : {})}
            onPress={event => event.stopPropagation()}
            onLayout={event => setMenuHeight(event.nativeEvent.layout.height)}
            style={{ maxWidth: width * (mobileMenu ? blue.BLUE_POPUP_SMALL_MOBILE_MAX_WIDTH_RATIO : blue.BLUE_POPUP_SMALL_LAPTOP_MAX_WIDTH_RATIO),
              maxHeight: mobileMenu ? height * 0.90 : height - (accountAnchor?.top ?? 0) - menuFont * 1.6,
              ...(!mobileMenu && accountAnchor ? { position: 'absolute', right: accountAnchor.right,
                top: accountAnchor.top + menuFont * 0.6 } : {}),
              padding: menuFont, borderRadius: blue.getBluePopupRadius(menuHeight, height),
              borderWidth: height * blue.BLUE_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO,
              borderColor: blue.BLUE_POPUP_FRAME_BORDER_COLOR, backgroundColor: LIGHT_POPUP_FRAME_BACKGROUND_COLOR,
              shadowColor: '#0a3c6a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.16, shadowRadius: 14, elevation: 8 }}>
            <View style={{ flexDirection: 'row',
              alignItems: 'center', justifyContent: 'space-between', gap: menuFont * 0.75,
              marginBottom: menuFont * 0.5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: menuFont * 0.75, flexShrink: 1 }}>
                {customizeVisible || friendsVisible ? <MenuGlyph name={customizeVisible ? 'settings' : 'friends'} size={menuFont * 1.15} /> : null}
                <NativeText ref={node => { menuNameRef.current = node; }} testID="account-panel-title" accessibilityRole="header"
                  accessibilityLabel={accountTitle} accessibilityLanguage={playerLanguage} {...{ lang: playerLanguage, tabIndex: -1 as const,
                    onPointerEnter: (event: { currentTarget: unknown }) => focusHoveredMenuControl(event, playerLanguage) }}
                  style={{ flexShrink: 1, color: blue.BLUE_POPUP_TITLE_COLOR, fontSize: accountTitleFont,
                    lineHeight: accountTitleFont * blue.BLUE_POPUP_MESSAGE_LINE_HEIGHT_RATIO, fontWeight: '700', textAlign: 'left' }}>{accountTitle}</NativeText>
              </View>
              <Pressable testID="account-menu-close" accessibilityRole="button" accessibilityLanguage={playerLanguage}
                accessibilityLabel={getSystemPopupCopy(playerLanguage).close}
                onPointerEnter={event => focusHoveredMenuControl(event, playerLanguage)} onPress={dismissAccount}
                style={({ pressed }) => ({ flexShrink: 0, alignItems: 'center', justifyContent: 'center',
                  width: menuFont * 2.4, height: menuFont * 2.4, opacity: pressed ? 0.8 : 1 })}>
                <Text aria-hidden scaleByDevice={false} style={{ color: blue.BLUE_POPUP_TITLE_COLOR,
                  fontSize: responsiveHeightFontSize(height * blue.BLUE_POPUP_CLOSE_FONT_RATIO, width, height, mobileMenu),
                  lineHeight: menuFont * 2.4 }}>×</Text>
              </Pressable>
            </View>
            <ScrollView style={{ flexGrow: 0, flexShrink: 1 }} keyboardShouldPersistTaps="handled">
              {accountPanel === 'friends' ? friendsVisible ? <FriendsPanel language={playerLanguage} /> : null
                : customizeVisible ? <CustomizeSettings key={voiceMode.sessionScope} onClose={dismissAccount} /> : <>
                <AccountMenuRow testID="account-customize-open" icon="settings" language={playerLanguage}
                  label={getCustomizeCopy(playerLanguage).title} onPress={() => { setCustomizeReadOnOpen(voiceMode.enabled); setAccountPanel('customize'); }} />
                <FriendsMenuEntry onOpen={() => { ownsFriends.current = true; setAccountPanel('friends'); }} />
                {isGuest && onSaveProgress ? <AccountMenuRow icon="sign-in" language={playerLanguage}
                  label={accountLabel} onPress={() => closeAccountAndRun(onSaveProgress)} /> : onSignOut ? <>
                  <View aria-hidden style={{ height: height * blue.BLUE_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO,
                    backgroundColor: blue.BLUE_POPUP_FRAME_BORDER_COLOR, opacity: 0.4, marginVertical: menuFont * 0.35 }} />
                  <AccountMenuRow testID="account-sign-out" icon="sign-out" language={playerLanguage}
                    label={getAccountSignOutLabel(playerLanguage)} busy={signOutBusy} onPress={() => closeAccountAndRun(onSignOut)} />
                </> : null}
                <AccountDeletionControl disabled={signOutBusy} />
              </>}
            </ScrollView>
          </Pressable> : null}
        </Pressable>
      </AppOverlay>

      <AiHelpDialog
        context={helpContext}
        getContext={() => helpContext?.screen === 'page'
          ? { ...helpContext, ...readPageHelpSnapshot(undefined, helpContext.page === 'public-content') } : helpContext}
        onClose={() => setHelpVisible(false)}
        onNavigate={onHelpNavigate}
        visible={helpVisible}
      />

    </>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: APP_HEADER_TOP,
    left: '3%',
    right: '3%',
    zIndex: 500,
    elevation: 500,
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    height: '100%',
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerAction: {
    height: '100%',
    justifyContent: 'center',
  },
  exitText: {
    color: '#0a3c6a',
    fontWeight: '700',
  },
  usernameButton: {
    height: '100%',
    justifyContent: 'center',
  },
  username: {
    color: '#4b7198',
    fontWeight: '700',
    textAlign: 'right',
  },
  lightExitText: {
    color: '#0a3c6a',
  },
  lightUsername: {
    color: '#0a3c6a',
  },
  lightHelpText: {
    color: '#4b7198',
  },
  signUpButton: {
    height: '100%',
    flexShrink: 0,
    justifyContent: 'center',
  },
  signUpText: {
    color: '#4b7198',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  helpButton: {
    height: '100%',
    flexShrink: 0,
    justifyContent: 'center',
  },
  helpText: {
    color: '#4b7198',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.65,
  },
});


