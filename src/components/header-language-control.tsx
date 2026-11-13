import { getConvention, getConventionArticles } from '@/lib/bridge-conventions';
import { CONVENTION_LANGUAGE_NAMES as LANGUAGE_NAMES } from '@/lib/convention-translations';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import DocumentLanguageSelector from '@/components/document-language-selector';
import usePlayerLanguage from '@/hooks/use-player-language';
import { CONVENTION_LANGUAGE_NAMES, getConventionUiCopy } from '@/lib/convention-translations';
import { type InfoLanguage } from '@/lib/info-popup-translations';

type Props = { size: number; gap: number; fontSize: number;
  onMenuHover?: (event: { currentTarget: unknown }) => void };


export default function HeaderLanguageControl({ size, gap, fontSize, onMenuHover }: Props) {
  const { language, selectLanguage } = usePlayerLanguage();
  const {slug} = useLocalSearchParams<{slug?:string}>();
  const currentArticle = getConvention(slug);
  const availableLanguages = (Object.keys(LANGUAGE_NAMES) as InfoLanguage[]).filter(option => !currentArticle || getConventionArticles(option).some(item => item.conventionId === currentArticle.conventionId));
  const [focused, setFocused] = useState(false);
  const { width, height } = useWindowDimensions();
  const label = getConventionUiCopy(language).selectLanguage;
  if (Platform.OS !== 'web') {
    return <View style={{ marginLeft: gap }}>
      <DocumentLanguageSelector language={language} selectLanguage={selectLanguage}
        bodyFont={fontSize} mobile={width < 768} availableLanguages={availableLanguages} />
    </View>;
  }
  return (
    <View style={{ width: size, height: size, marginLeft: gap }}>
      <svg aria-hidden="true" focusable="false" width={size} height={size}
        viewBox="0 0 24 24" fill="none" stroke="#0a3c6a"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <ellipse cx="12" cy="12" rx="4" ry="10" />
        <path d="M2 12h20" />
      </svg>
      <select
        onMouseEnter={onMenuHover}
        aria-label={label}
        title={label}
        value={language}
        onChange={event => selectLanguage(event.currentTarget.value as InfoLanguage)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          opacity: 0, cursor: 'pointer', fontSize,
        }}
      >
        {availableLanguages.map(option => <option key={option} value={option}>
          {CONVENTION_LANGUAGE_NAMES[option]}
        </option>)}
      </select>
      {focused ? <View pointerEvents="none" style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        borderColor: '#0a3c6a', borderWidth: height * 0.001,
      }} /> : null}
    </View>
  );
}
