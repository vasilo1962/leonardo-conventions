import { useLayoutEffect, useRef, useState } from 'react';
import { TableAnnouncementLog, useTableAnnouncementLog } from '@/shared/accessibility/table-announcements';
import useAiHelpHover from '@/shared/accessibility/use-ai-help-hover';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';


import AppOverlay from '@/components/app-overlay';
import Text from '@/components/app-text';
import TextInput from '@/components/app-text-input';
import GameActionButton from '@/components/game-action-button';
import type {
  HelpAction,
  HelpContext,
  HelpReply,
} from '@/lib/ai-help';
import {
  deviceScaledSize,
  textFrameHeight,
} from '@/lib/interface-scale';
import { supabase } from '@/lib/supabase';
import { getPlayerInfoLanguage, type InfoLanguage } from '@/lib/info-popup-translations';
import { getSystemPopupCopy } from '@/lib/system-popup-translations';

type AiHelpDialogProps = {
  visible: boolean;
  context?: HelpContext;
  getContext?: () => HelpContext | undefined;
  onClose: () => void;
  onNavigate?: (action: HelpAction) => void;
};

type HelpLanguage = InfoLanguage;

type HelpTurn = {
  language: HelpLanguage;
  question: string;
  reply: HelpReply | null;
  error: string | null;
};

function getDetectedHelpLanguage(): HelpLanguage {
  return getPlayerInfoLanguage();
}

function getOriginalLanguageLabel(): string {
  return 'YOUR LANGUAGE';
}

export default function AiHelpDialog({
  visible,
  context,
  getContext,
  onClose,
  onNavigate,
}: AiHelpDialogProps) {
  const [question, setQuestion] = useState('');
  const [turns, setTurns] = useState<HelpTurn[]>([]);
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState<HelpLanguage>(getDetectedHelpLanguage);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const copy = getSystemPopupCopy(language);
  const readingRoot = useRef<unknown>(null);
  useAiHelpHover(readingRoot, visible, language);
  const { entries, announce, clear } = useTableAnnouncementLog(language);
  const activeRequest = useRef(0);
  const contextScope = context?.screen === 'page' ? JSON.stringify([
    context.page, context.state.mode, context.state.phase, context.state.view,
    context.state.retry, context.state.dealNumber, context.state.role, context.state.owner, context.state.seats, context.state.document, context.state.article,
  ]) : context?.screen;
  const [previousScope, setPreviousScope] = useState(contextScope);
  if (previousScope !== contextScope) {
    setPreviousScope(contextScope);
    setQuestion(''); setTurns([]); setBusy(false);
  }
  useLayoutEffect(() => {
    clear();
    return () => { activeRequest.current += 1; };
  }, [visible, clear, contextScope]);

  const readable = (text: string, textLanguage: HelpLanguage = language) => ({
    testID: 'ai-help-readable',
    tabIndex: -1 as const,
    accessibilityLabel: text,
    accessibilityLanguage: textLanguage,
    lang: textLanguage,
  });
  function close() {
    activeRequest.current += 1;
    clear();
    onClose();
  }

  const helpReady = (
    context?.screen === 'page'
    || context?.screen === 'home'
    || context?.screen === 'duels'
    || context?.screen === 'tournaments'
    || context?.screen === 'federation-table'
    || context?.screen === 'auth'
  );
  const canSend = helpReady && question.trim().length > 0 && !busy;
  function actionAllowed(action: HelpReply['action']) {
    if (!action || !context) {
      return false;
    }

    return context.allowedActions.some(
      allowedAction =>
        allowedAction.destination === action.destination
        && allowedAction.label === action.label
        && (allowedAction.targetId ?? null) === (action.targetId ?? null)
    );
  }

  const [previousVisible, setPreviousVisible] = useState(visible);
  if (previousVisible !== visible) {
    setPreviousVisible(visible);
    if (visible) {
      setLanguage(getDetectedHelpLanguage());
    } else {
      setQuestion('');
      setTurns([]);
      setBusy(false);
      setLanguageMenuOpen(false);
    }
  }

  function chooseLanguage(nextLanguage: HelpLanguage) {
    setLanguage(nextLanguage);
    setLanguageMenuOpen(false);
  }

  function handleLanguagePress() {
    if (language === 'en') {
      setLanguageMenuOpen(open => !open);
      return;
    }

    setLanguage('en');
    setLanguageMenuOpen(false);
  }

  async function ask(nextQuestion?: string) {
    const submittedQuestion = (nextQuestion ?? question).trim();

    if (!visible || !context || !helpReady || !submittedQuestion || busy) {
      return;
    }

    const currentContext = getContext?.() ?? context;
    if (!currentContext) return;
    const request = ++activeRequest.current;
    setQuestion('');
    setTurns(current => [
      ...current,
      { question: submittedQuestion, language, reply: null, error: null },
    ]);
    setBusy(true);

    try {
      const history = turns
        .filter(turn => turn.reply)
        .slice(-6)
        .map(turn => ({
          question: turn.question,
          answer: turn.reply!.answer,
        }));
      const { data, error: functionError } = await supabase.functions.invoke(
        'ai-help',
        { body: { question: submittedQuestion, context: currentContext, language, history } }
      );

      if (activeRequest.current !== request) return;
      if (functionError) {
        throw functionError;
      }

      const nextReply = data as HelpReply;
      if (!nextReply || typeof nextReply.answer !== 'string') {
        throw new Error('Invalid help response.');
      }

      setTurns(current => current.map((turn, index) =>
        index === current.length - 1 ? { ...turn, reply: nextReply } : turn
      ));
      announce(nextReply.answer, language);
    } catch {
      if (activeRequest.current !== request) return;
      setTurns(current => current.map((turn, index) =>
        index === current.length - 1 ? { ...turn, error: copy.helpUnavailable } : turn
      ));
      announce(copy.helpUnavailable, language);
    } finally {
      if (activeRequest.current === request) setBusy(false);
    }
  }

  function navigate(action: HelpAction) {
    close();
    onNavigate?.(action);
  }

  return (
    <AppOverlay
      animationType="fade"
      transparent
      visible={visible}
      announceContent={false}
      onRequestClose={close}
    >
      <View style={styles.overlay}>
        <View ref={node => { readingRoot.current = node; }}
          accessibilityViewIsModal {...{ lang: language }} style={styles.dialogCard}>
          <TableAnnouncementLog entries={entries} />
          <View style={styles.titleRow}>
            <Text {...readable('AI HELP')} style={styles.dialogTitle}>AI HELP</Text>
            <View style={styles.titleActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={language === 'en' ? '🌐 CHOOSE LANGUAGE' : '🌐 ENGLISH'}
                accessibilityLanguage={language}
                {...{ lang: language }}
                onPress={handleLanguagePress}
                style={({ pressed }) => [
                  styles.languageButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.languageButtonText}>
                  {language === 'en' ? '🌐 CHOOSE LANGUAGE' : '🌐 ENGLISH'}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={copy.helpClose}
                accessibilityLanguage={language}
                {...{ lang: language }}
                onPress={close}
                style={({ pressed }) => [
                  styles.iconClose,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.iconCloseText}>×</Text>
              </Pressable>
            </View>
          </View>

          {languageMenuOpen ? (
            <View style={styles.languageMenu}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={getOriginalLanguageLabel()}
                accessibilityLanguage={language}
                {...{ lang: language }}
                onPress={() => chooseLanguage(getDetectedHelpLanguage())}
                style={({ pressed }) => [
                  styles.languageOption,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.languageOptionText}>
                  {getOriginalLanguageLabel()}
                </Text>
              </Pressable>
            </View>
          ) : null}

          {!helpReady ? (
            <>
              <Text {...readable(copy.helpComing)} style={styles.message}>
                {copy.helpComing}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={copy.close.toUpperCase()}
                accessibilityLanguage={language}
                {...{ lang: language }}
                onPress={close}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>{copy.close.toUpperCase()}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <ScrollView
                contentContainerStyle={styles.conversation}
                keyboardShouldPersistTaps="handled"
                style={styles.conversationScroll}
              >
                {turns.length === 0 ? (
                  <Text {...readable(copy.helpQuestion)} style={styles.prompt}>{copy.helpQuestion}</Text>
                ) : turns.map((turn, index) => (
                  <View key={`${turn.question}-${index}`} {...{ lang: turn.language }} style={styles.turn}>
                    <Text {...readable(turn.question, turn.language)} style={styles.question}>{turn.question}</Text>
                    {turn.reply ? (
                      <>
                        <Text {...readable(turn.reply.answer, turn.language)} style={styles.answer}>{turn.reply.answer}</Text>
                        {turn.reply.action && actionAllowed(turn.reply.action) ? (
                          <GameActionButton
                            label={turn.reply.action.label}
                            accessibilityLanguage={turn.language}
                            onPress={() => navigate(turn.reply!.action!)}
                            style={styles.suggestedAction}
                          />
                        ) : null}
                      </>
                    ) : turn.error ? (
                      <Text {...readable(turn.error, turn.language)} style={styles.error}>{turn.error}</Text>
                    ) : (
                      <ActivityIndicator color="#4b7198" size="large" />
                    )}
                  </View>
                ))}
              </ScrollView>

              <View style={styles.inputRow}>
                <TextInput
                  accessibilityLabel={copy.helpQuestion}
                  accessibilityLanguage={language}
                  {...{ lang: language }}
                  autoFocus
                  editable={!busy}
                  multiline
                  onChangeText={setQuestion}
                  onKeyPress={event => {
                    if (event.nativeEvent.key === 'Enter' && canSend) {
                      event.preventDefault();
                      void ask();
                    }
                  }}
                  placeholder={copy.helpPlaceholder}
                  placeholderTextColor="#697789"
                  style={styles.input}
                  value={question}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </AppOverlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: deviceScaledSize(22),
  },
  dialogCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '82%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4b7198',
    backgroundColor: '#dde7f1',
    padding: deviceScaledSize(22),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageButton: {
    minHeight: textFrameHeight(14),
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  languageButtonText: {
    color: '#0a3c6a',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  languageMenu: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  languageOption: {
    minHeight: textFrameHeight(14),
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4b7198',
    paddingHorizontal: 12,
  },
  languageOptionSelected: {
    borderColor: '#4b7198',
    backgroundColor: '#edf3f8',
  },
  languageOptionText: {
    color: '#0a3c6a',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  dialogTitle: {
    color: '#0a3c6a',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  iconClose: {
    minWidth: textFrameHeight(18),
    minHeight: textFrameHeight(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCloseText: {
    color: '#0a3c6a',
    fontSize: 28,
    lineHeight: 30,
  },
  conversationScroll: {
    minHeight: 130,
    maxHeight: 330,
    marginTop: 18,
  },
  conversation: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  turn: {
    gap: 10,
    marginBottom: 18,
  },
  question: {
    color: '#0a3c6a',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '800',
    textAlign: 'left',
  },
  prompt: {
    color: '#4b7198',
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  answer: {
    color: '#0a3c6a',
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  suggestedAction: {
    marginTop: 10,
  },
  error: {
    color: '#4b7198',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  message: {
    color: '#0a3c6a',
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 22,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  input: {
    width: '100%',
    minHeight: textFrameHeight(18),
    maxHeight: deviceScaledSize(120),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b7198',
    color: '#0a3c6a',
    backgroundColor: '#faf4ee',
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 13,
    paddingVertical: deviceScaledSize(9),
  },
  primaryButton: {
    minHeight: textFrameHeight(18),
    alignSelf: 'center',
    borderRadius: 14,
    backgroundColor: '#edf3f8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#0a3c6a',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.45,
  },
});
