import { useState } from 'react';
import { Pressable, View } from 'react-native';

import Text from '@/components/app-text';
import { CONVENTION_LANGUAGE_NAMES, getConventionUiCopy } from '@/lib/convention-translations';
import { INFO_LANGUAGES, type InfoLanguage } from '@/lib/info-popup-translations';

const languageCollator = new Intl.Collator('en', { sensitivity: 'base' });
const usesLatinAlphabet = (name: string) => /^[A-Za-z]/.test(name.normalize('NFD'));
const sortedLanguages = [...INFO_LANGUAGES].sort((left, right) => {
  const leftName = CONVENTION_LANGUAGE_NAMES[left];
  const rightName = CONVENTION_LANGUAGE_NAMES[right];
  const alphabetOrder = Number(usesLatinAlphabet(rightName)) - Number(usesLatinAlphabet(leftName));
  return alphabetOrder || languageCollator.compare(leftName, rightName);
});

type Props = {
  language: InfoLanguage;
  selectLanguage: (language: InfoLanguage) => void;
  bodyFont: number;
  mobile: boolean;
  availableLanguages?: readonly InfoLanguage[];
};

export default function DocumentLanguageSelector({ language, selectLanguage, bodyFont, mobile, availableLanguages }: Props) {
  const [choosingLanguage, setChoosingLanguage] = useState(false);
  const space = bodyFont * 0.35;
  const columns = mobile ? 2 : 3;
  const languages = availableLanguages
    ? sortedLanguages.filter(option => availableLanguages.includes(option))
    : sortedLanguages;
  const rows = Array.from(
    { length: Math.ceil(languages.length / columns) },
    (_, row) => Array.from(
      { length: columns },
      (_, column) => languages[row * columns + column]
    )
  );
  return (
    <View style={{ gap: space }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={getConventionUiCopy(language).selectLanguage}
        accessibilityState={{ expanded: choosingLanguage }}
        onPress={() => setChoosingLanguage(current => !current)}
        style={{ alignSelf: 'flex-end' }}
      >
        <Text style={{
          color: '#0a3c6a',
          textDecorationLine: 'underline',
          fontSize: bodyFont,
          lineHeight: bodyFont * 1.60,
        }}>{'🌐 ' + CONVENTION_LANGUAGE_NAMES[language]}</Text>
      </Pressable>
      {choosingLanguage ? (
        <View style={{ gap: space }}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: 'row', gap: space }}>
              {row.map((option, columnIndex) => option ? (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityLabel={CONVENTION_LANGUAGE_NAMES[option]}
                  accessibilityState={{ selected: option === language }}
                  style={{ flex: 1, minWidth: 0 }}
                  onPress={() => {
                    selectLanguage(option);
                    setChoosingLanguage(false);
                  }}
                >
                  <Text style={{
                    color: '#0a3c6a',
                    textDecorationLine: 'underline',
                    fontSize: bodyFont,
                    lineHeight: bodyFont * 1.60,
                    fontWeight: option === language ? '800' : '400',
                    textAlign: 'left',
                  }}>{CONVENTION_LANGUAGE_NAMES[option]}</Text>
                </Pressable>
              ) : (
                <View key={columnIndex} style={{ flex: 1 }} />
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
