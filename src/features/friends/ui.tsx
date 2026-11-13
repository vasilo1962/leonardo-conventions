import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import AccountMenuRow from '@/components/account-menu-row';
import AppOverlay from '@/components/app-overlay';
import PopupLanguageControl from '@/components/popup-language-control';
import { usePopupLanguage } from '@/hooks/use-popup-language';
import usePlayerLanguage from '@/hooks/use-player-language';
import { useVoiceMode } from '@/shared/accessibility/voice-mode';
import useInfoMessageReading from '@/shared/accessibility/use-info-message-reading';
import { useActivityPopups, useActivityPopupBlocker } from '@/shared/notifications/activity-popup-provider';
import { focusHoveredMenuControl } from '@/shared/accessibility/menu-hover-focus';
import { responsiveHeightFontSize } from '@/lib/interface-scale';
import * as blue from '@/lib/blue-popup-style';
import { LIGHT_POPUP_FRAME_BACKGROUND_COLOR } from '@/lib/light-popup-style';
import ClaimStatusCard from '@/bridge/claim/status-card';
import type { InfoLanguage } from '@/lib/info-popup-translations';
import { friendsRpc, type FriendPerson, type FriendInvitation, type FriendRelation } from './api';
import { getFriendCopy } from './copy';
import { getFriendRemovalCopy } from './removal-copy';
import FriendRequestPopup from './friend-request-popup';
import { useFriends } from './provider';

function invitationDetails(invitation: FriendInvitation | undefined) {
  if (!invitation) return '';
  return invitation.kind === 'table' ? invitation.table_name ?? '' : invitation.settings
    ? `${invitation.settings.game_type === 'bid_and_play' ? 'Bid and Play' : 'Just Declare'} · ${invitation.settings.deal_count}` : '';
}

function useMetrics() {
  const { width, height } = useWindowDimensions();
  const mobile = width < 768;
  const font = responsiveHeightFontSize(height * blue.BLUE_POPUP_MESSAGE_FONT_RATIO, width, height, mobile);
  const titleFont = responsiveHeightFontSize(height * blue.BLUE_POPUP_TITLE_FONT_RATIO, width, height, mobile);
  const sentHeadingFont = responsiveHeightFontSize(height * 0.024, width, height, mobile);
  const actionFont = responsiveHeightFontSize(height * blue.BLUE_POPUP_BUTTON_FONT_RATIO, width, height, mobile);
  return { width, height, mobile, font, titleFont, sentHeadingFont, actionFont };
}
function Action({ label, onPress, disabled, language }: {
  label: string; onPress: () => void; disabled?: boolean; language: InfoLanguage;
}) {
  const { actionFont: font, height } = useMetrics();
  const [size, setSize] = useState(0);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityLanguage={language}
    accessibilityState={{ disabled: Boolean(disabled) }}
    {...{ lang: language }} disabled={disabled} onPress={onPress}
    onHoverIn={event => focusHoveredMenuControl(event, language)}
    onLayout={event => setSize(event.nativeEvent.layout.height)}
    style={({ pressed }) => ({ alignSelf: 'stretch', alignItems: 'center',
      paddingHorizontal: font * 1.5, paddingVertical: font * 0.35,
      borderWidth: height * blue.BLUE_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO,
      borderColor: blue.BLUE_POPUP_BUTTON_BORDER_COLOR, borderRadius: blue.getBluePopupButtonRadius(size),
      backgroundColor: LIGHT_POPUP_FRAME_BACKGROUND_COLOR,
      opacity: disabled ? 0.55 : pressed ? 0.80 : 1 })}>
    <Text aria-hidden style={{ color: blue.BLUE_POPUP_BUTTON_COLOR, fontSize: font, lineHeight: font * 1.3,
      fontWeight: '900', textAlign: 'center' }}>{label}</Text>
  </Pressable>;
}
function Frame({ children, onClose, language, playerLanguage, showEnglish, toggleLanguage }: {
  children: ReactNode; onClose: () => void; language: InfoLanguage; playerLanguage: InfoLanguage;
  showEnglish: boolean; toggleLanguage: () => void;
}) {
  const { width, height, mobile, font } = useMetrics();
  const [size, setSize] = useState(0);
  return <AppOverlay visible transparent animationType="fade" announceContent={false} readPrimaryAction={false} onRequestClose={onClose}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.60)' }}>
      <View testID="friends-frame" accessibilityLanguage={language} {...{ lang: language }}
        accessibilityViewIsModal style={{ maxWidth: width * (mobile ? blue.BLUE_POPUP_SMALL_MOBILE_MAX_WIDTH_RATIO : blue.BLUE_POPUP_SMALL_LAPTOP_MAX_WIDTH_RATIO),
          maxHeight: '90%', padding: font * blue.BLUE_POPUP_CONTENT_PADDING_TO_MESSAGE_FONT_RATIO,
          backgroundColor: LIGHT_POPUP_FRAME_BACKGROUND_COLOR, borderColor: blue.BLUE_POPUP_FRAME_BORDER_COLOR,
          borderWidth: height * blue.BLUE_POPUP_FRAME_BORDER_TO_SCREEN_HEIGHT_RATIO, borderRadius: blue.getBluePopupRadius(size, height) }}
        onLayout={event => setSize(event.nativeEvent.layout.height)}>
        <View style={{ flexShrink: 1 }}>
        <PopupLanguageControl variant="light" playerLanguage={playerLanguage} showEnglish={showEnglish} onPress={toggleLanguage} onClose={onClose} />
        <ScrollView style={{ flexGrow: 0, flexShrink: 1 }} keyboardShouldPersistTaps="handled">{children}</ScrollView>
        </View>
      </View>
    </View>
  </AppOverlay>;
}

// Confirmation stays inside the existing account card; no additional overlay or notice.
function FriendRow({ person, language, onRemoved }: {
  person: FriendRelation; language: InfoLanguage; onRemoved: () => void;
}) {
  const friends = useFriends()!;
  const { font, actionFont } = useMetrics();
  const voice = useVoiceMode();
  const copy = getFriendRemovalCopy(language, person.username);
  const [confirming, setConfirming] = useState(false);
  const submitting = useRef(false);
  const removeRef = useRef<View>(null);
  const messageRef = useRef<Text>(null);
  useInfoMessageReading(messageRef, confirming, voice.enabled, copy.message, language);
  const readable = { accessible: true, accessibilityLanguage: language, lang: language, tabIndex: -1 as const,
    onPointerEnter: (event: { currentTarget: unknown }) => focusHoveredMenuControl(event, language) };
  const textStyle = { color: '#0a3c6a', fontSize: font,
    lineHeight: font * blue.BLUE_POPUP_MESSAGE_LINE_HEIGHT_RATIO, fontWeight: '400' as const };
  async function confirm() {
    if (submitting.current || friends.busy) return;
    submitting.current = true;
    try {
      await friends.change(person.user_id, 'remove');
      onRemoved();
    } catch { /* The provider keeps the error visible and this confirmation available for retry. */ }
    finally { submitting.current = false; }
  }
  return <View testID={'friend-row-' + person.id} style={{ gap: font * 0.35 }}>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: font * 0.7 }}>
      <Text {...readable} accessibilityLabel={person.username} style={[textStyle, { flexShrink: 1 }]}>{person.username}</Text>
      <Pressable ref={removeRef} testID={'friend-remove-' + person.id} accessibilityRole="button"
        accessibilityLabel={copy.label} accessibilityLanguage={language} {...{ lang: language }}
        accessibilityState={{ disabled: friends.busy, expanded: confirming }} disabled={friends.busy}
        onPointerEnter={event => focusHoveredMenuControl(event, language)}
        onPress={() => setConfirming(true)}
        style={({ pressed }) => ({ width: actionFont * 2.4, height: actionFont * 2.4,
          alignItems: 'center', justifyContent: 'center', opacity: friends.busy ? 0.55 : pressed ? 0.80 : 1 })}>
        <Text aria-hidden style={{ fontSize: actionFont, lineHeight: actionFont * 1.3, color: '#0a3c6a' }}>×</Text>
      </Pressable>
    </View>
    {confirming ? <View testID={'friend-remove-confirmation-' + person.id} style={{ gap: font * 0.7 }}>
      <Text ref={messageRef} {...readable} testID="friend-remove-message" accessibilityLabel={copy.message}
        style={textStyle}>{copy.message}</Text>
      <Action label={getFriendCopy(language).cancel} disabled={friends.busy} language={language}
        onPress={() => { setConfirming(false); removeRef.current?.focus(); }} />
      <Action label={copy.remove} disabled={friends.busy} language={language} onPress={() => { void confirm(); }} />
    </View> : null}
  </View>;
}

export function FriendsMenuEntry({ onOpen }: { onOpen: () => void }) {
  const friends = useFriends();
  const { language } = usePlayerLanguage();
  if (!friends?.enabled) return null;
  return <AccountMenuRow icon="friends" testID="account-friends-open" label={getFriendCopy(language).title} language={language}
    onPress={() => { onOpen(); friends.setOpen(true); void friends.refresh(); }} />;
}
export function FriendsPanel({ language }: { language: InfoLanguage }) {
  const friends = useFriends()!;
  useActivityPopupBlocker(true);
  const { font, titleFont, sentHeadingFont, actionFont, height } = useMetrics();
  const copy = getFriendCopy(language);
  const searchRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FriendPerson[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [searched, setSearched] = useState(false);
  const generation = useRef(0);
  const searchInFlight = useRef(false);
  useEffect(() => () => { generation.current += 1; }, []);
  async function search() {
    if (searchInFlight.current || query.trim().length < 2) return;
    searchInFlight.current = true;
    const version = ++generation.current;
    setSearching(true); setSearchFailed(false); setResults([]); setSearched(false);
    try {
      const rows = await friendsRpc<FriendPerson[]>('friends_search', { p_username: query.trim() });
      if (generation.current === version) { setResults(rows); setSearched(true); }
    } catch { if (generation.current === version) setSearchFailed(true); }
    finally { searchInFlight.current = false; if (generation.current === version) setSearching(false); }
  }
  const textStyle = { color: '#0a3c6a', fontSize: font, lineHeight: font * blue.BLUE_POPUP_MESSAGE_LINE_HEIGHT_RATIO, fontWeight: '400' as const, textAlign: 'left' as const };
  const readable = {
    accessible: true, accessibilityLanguage: language, lang: language, tabIndex: -1 as const,
    onPointerEnter: (event: {currentTarget: unknown}) => focusHoveredMenuControl(event, language),
  };
  const text = (value: string, bold = false) => <Text {...readable} accessibilityLabel={value}
    style={[textStyle, bold && { fontWeight: '700' }]}>{value}</Text>;
  const action = (label: string, run: () => Promise<void> | void, disabled = friends.busy) =>
    <Action key={label} {...{ label, disabled, language }} onPress={() => {
      void Promise.resolve(run()).catch(() => undefined);
    }} />;
  const people = friends.data?.people ?? [];
  const section = (label: string, children: ReactNode, sent = false) => <View style={{ gap: font * 0.35, marginTop: titleFont * 0.35 }}>
    <Text {...readable} accessibilityRole="header" accessibilityLabel={label} style={{ color: blue.BLUE_POPUP_TITLE_COLOR, textAlign: 'left', fontSize: sent ? sentHeadingFont : titleFont,
      lineHeight: (sent ? sentHeadingFont : titleFont) * blue.BLUE_POPUP_MESSAGE_LINE_HEIGHT_RATIO, fontWeight: sent ? '600' : '900' }}>{label}</Text>{children}
  </View>;
  const incoming = people.filter(p => p.status === 'pending' && p.incoming);
  const outgoing = people.filter(p => p.status === 'pending' && !p.incoming);
  return <View testID="friends-panel" style={{ gap: font * 0.7 }}>
    {!friends.data ? text(copy.loading) : people.filter(p => p.status === 'accepted').map(p =>
      <FriendRow key={p.id} person={p} language={language} onRemoved={() => searchRef.current?.focus()} />)}
    <TextInput ref={searchRef} testID="friends-search" onPointerEnter={event => focusHoveredMenuControl(event, language)} value={query} onChangeText={value => {
      generation.current += 1; setQuery(value); setResults([]); setSearched(false); setSearching(false);
    }} onSubmitEditing={() => { void search(); }} autoCapitalize="none" autoCorrect={false}
      placeholder={copy.hint} placeholderTextColor="#4b7198" accessibilityLabel={copy.hint} accessibilityLanguage={language} {...{ lang: language }}
      style={[textStyle, { height: font * 2.5, paddingHorizontal: font * 0.82,
        borderWidth: height * blue.BLUE_POPUP_BUTTON_BORDER_TO_SCREEN_HEIGHT_RATIO, borderColor: '#4b7198' }]} />
    {query.trim() && !(searched && results.length > 0) ? <Action label={copy.search} onPress={() => { void search(); }} disabled={searching || query.trim().length < 2} language={language} /> : null}
    {searching || friends.busy ? <ActivityIndicator color="#0a3c6a" /> : null}
    {friends.failed || searchFailed ? <>
      <Text accessibilityRole="alert" accessibilityLanguage={language} style={textStyle}>{copy.failed}</Text>
      {action(copy.retry, friends.refresh)}
    </> : null}
    {searched && !results.length ? text('—') : null}
    {results.map(person => <View key={person.user_id} style={{ gap: font * 0.35 }}>
      {text(person.username)}
      {people.some(p => p.user_id === person.user_id) ? null : action(copy.add, () => friends.change(person.user_id, 'request'))}
    </View>)}
    {friends.data ? <>
      {incoming.length ? section(copy.requests, incoming.map(p => <View key={p.id} style={{ gap: font * 0.35 }}>
        {text(p.username)}{action(copy.accept, () => friends.change(p.user_id, 'accept'))}
        {action(copy.reject, () => friends.change(p.user_id, 'reject'))}
      </View>)) : null}
      {outgoing.length ? section(copy.sent, outgoing.map(p => <View key={p.id}
        style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: font * 0.7 }}>
        <Text {...readable} accessibilityLabel={p.username} style={[textStyle, { flexShrink: 1 }]}>{p.username}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={copy.cancel} accessibilityLanguage={language}
          accessibilityState={{ disabled: friends.busy }} {...{ lang: language }} disabled={friends.busy}
          onHoverIn={event => focusHoveredMenuControl(event, language)}
          onPress={() => { void friends.change(p.user_id, 'cancel').catch(() => undefined); }}
          style={({ pressed }) => ({ paddingVertical: actionFont * 0.35, flexShrink: 1,
            opacity: friends.busy ? 0.55 : pressed ? 0.80 : 1 })}>
          <Text aria-hidden style={{ color: blue.BLUE_POPUP_MESSAGE_COLOR, fontSize: actionFont,
            lineHeight: actionFont * blue.BLUE_POPUP_MESSAGE_LINE_HEIGHT_RATIO, fontWeight: '400' }}>{copy.cancel}</Text>
        </Pressable>
      </View>), true) : null}
      {friends.data.invitations.map(i => <View key={i.id} style={{ gap: font * 0.35 }}>
        {text(`${i.username} — ${i.kind === 'duel' ? copy.duelNotice : copy.tableNotice}`, true)}
        {invitationDetails(i) ? text(invitationDetails(i)) : null}
        {friends.playing ? text(copy.wait) : null}
        {action(copy.accept, () => friends.respond(i.id, true), friends.busy || friends.playing)}
        {action(copy.reject, () => friends.respond(i.id, false))}
      </View>)}
    </> : null}
  </View>;
}

export function FriendsNotifications() {
  const friends = useFriends();
  const notice = friends?.notice;
  const popup = useActivityPopups(notice && !friends.playing && !friends.open
    ? [{ key: `friends:${notice.id}`, kind: 'friends' }] : []);
  const languages = usePopupLanguage(popup === 'friends');
  const { font } = useMetrics();
  const voice = useVoiceMode();
  const messageRef = useRef<Text>(null);
  const copy = getFriendCopy(languages.language);
  const label = notice?.kind === 'request' ? copy.requestNotice : notice?.kind === 'duel' ? copy.duelNotice : copy.tableNotice;
  const details = invitationDetails(friends?.data?.invitations.find(i => i.id === notice?.id));
  const message = notice ? `${notice.username} — ${label}${details ? '\n' + details : ''}` : '';
  useInfoMessageReading(messageRef, popup === 'friends' && (notice?.kind === 'duel' || notice?.kind === 'table'), voice.enabled, message, languages.language);
  if (popup !== 'friends' || !notice || !friends) return null;
  const close = () => { if (!friends.busy) void friends.dismiss(notice).catch(() => undefined); };
  const respond = (accept: boolean) => {
    if (notice.kind === 'request') {
      const person = friends.data?.people.find(p => p.id === notice.id);
      if (person) void friends.change(person.user_id, accept ? 'accept' : 'reject').catch(() => undefined);
    } else if (notice.kind !== 'friend-accepted') void friends.respond(notice.id, accept).catch(() => undefined);
  };
  if (notice.kind === 'friend-accepted') return <FriendRequestPopup {...languages} accepted username={notice.username}
    busy={friends.busy} failed={friends.failed} onClose={close} />;
  if (notice.kind === 'request') return <FriendRequestPopup {...languages} username={notice.username}
    busy={friends.busy} failed={friends.failed} onClose={close} onAccept={() => respond(true)} onReject={() => respond(false)} />;
  return <Frame {...languages} onClose={close}>
    <View style={{ gap: font * 0.7 }}>
      <Text ref={messageRef} accessibilityLanguage={languages.language} {...{ lang: languages.language, tabIndex: -1 as const }}
        style={{ color: '#0a3c6a', fontSize: font, lineHeight: font * blue.BLUE_POPUP_MESSAGE_LINE_HEIGHT_RATIO }}>{message}</Text>
      {friends.failed ? <Text accessibilityRole="alert" accessibilityLanguage={languages.language} style={{ color: '#0a3c6a', fontSize: font }}>{copy.failed}</Text> : null}
      <Action label={copy.accept} onPress={() => respond(true)} disabled={friends.busy} language={languages.language} />
      <Action label={copy.reject} onPress={() => respond(false)} disabled={friends.busy} language={languages.language} />
    </View>
  </Frame>;
}

export function FriendsActivityNotice() {
  const friends = useFriends();
  const { language } = usePlayerLanguage();
  const [shown, setShown] = useState<string | null>(null);
  const notice = friends?.playing && (friends.notice?.kind === 'duel' || friends.notice?.kind === 'table') ? friends.notice : null;
  const noticeId = notice?.id;
  const noticeKind = notice?.kind;
  const noticeName = notice?.username;
  const dismiss = useRef(friends?.dismiss);
  useEffect(() => { dismiss.current = friends?.dismiss; }, [friends?.dismiss]);
  useEffect(() => {
    if (!noticeId || !noticeKind || !noticeName || shown !== noticeId) return;
    const timer = setTimeout(() => { void dismiss.current?.({ id: noticeId, kind: noticeKind, username: noticeName }).catch(() => undefined); }, 2000);
    return () => clearTimeout(timer);
  }, [noticeId, noticeKind, noticeName, shown]);
  if (!notice) return null;
  const copy = getFriendCopy(language);
  const label = notice.kind === 'duel' ? copy.duelNotice : copy.tableNotice;
  return <View pointerEvents="none" aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', zIndex: 2500, elevation: 2500 }}>
    <ClaimStatusCard message={`${notice.username} — ${label}`} language={language} onShown={() => setShown(notice.id)} />
  </View>;
}

