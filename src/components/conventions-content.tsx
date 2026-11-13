import { LOBBY_TITLE_FONT_RATIO, LOBBY_SECTION_FONT_RATIO } from '@/lib/lobby-section-style';
import { getSharedLobbyHeadingTopGap } from '@/lib/shared-lobby-width';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { usePublicDocumentLanguage as useConventionsLanguage } from '@/shared/public-content/document-language';
import { getConventionUiCopy, getLocalizedConvention } from '@/lib/convention-translations';
import Text from '@/components/app-text';
import { PublicPageBack } from '@/components/conventions-page-shell';
import { responsiveHeightFontSize } from '@/lib/interface-scale';
import { getConventionArticles, type ConventionArticle } from '@/lib/bridge-conventions';

export default function ConventionsContent({ article }: { article?: ConventionArticle }) {
  const { language } = useConventionsLanguage();
  const copy = getConventionUiCopy(language);
  const localizedArticle = article ? getLocalizedConvention(article, language) : undefined;
  const rtl = language === 'ar' || language === 'he';
  const direction = { textAlign: rtl ? 'right' as const : 'left' as const, writingDirection: 'ltr' as const };
  const { width, height } = useWindowDimensions();
  const mobile = width < 820;
  const bodyFont = responsiveHeightFontSize(height * 0.020, width, height, mobile);
  const headingFont = responsiveHeightFontSize(height * LOBBY_SECTION_FONT_RATIO, width, height, mobile);
  const titleFont = responsiveHeightFontSize(height * LOBBY_TITLE_FONT_RATIO, width, height, mobile);
  const space = bodyFont * 0.35;
  const sectionSpace = headingFont * 1.40;

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{
        paddingHorizontal: width * (mobile ? 0.03 : 0.02),
        paddingTop: getSharedLobbyHeadingTopGap(height),
        paddingBottom: sectionSpace,
        gap: sectionSpace,
      }}
    >
      {localizedArticle ? (
        <>
          <Text accessibilityRole="header" style={[styles.title, direction, {
            fontSize: titleFont, lineHeight: titleFont * 1.60,
          }]}>{localizedArticle.title}</Text>
          <Link href="/" style={[styles.link, { fontSize: bodyFont }]}>
            {copy.conventions}
          </Link>
          {localizedArticle.sections.map((section, index) => (
            <View key={index} style={{ gap: space }}>
              {section.heading ? (
                <Text accessibilityRole="header" style={[styles.heading, direction, {
                  fontSize: headingFont, lineHeight: headingFont * 1.60,
                }]}>{section.heading}</Text>
              ) : null}
              {section.lines.map((line, lineIndex) => (
                <Text key={lineIndex} style={[styles.body, direction, {
                  fontSize: bodyFont, lineHeight: bodyFont * 1.60,
                }]}>{line}</Text>
              ))}
            </View>
          ))}
        </>
      ) : (
        <>
          <Text accessibilityRole="header" style={[styles.title, {
            fontSize: titleFont, lineHeight: titleFont * 1.60,
          }]}>{copy.conventions} Bridge</Text>
          <Text style={[styles.body, { fontSize: bodyFont, lineHeight: bodyFont * 1.60 }]}>
            {copy.intro}
          </Text>
          <View style={{ gap: space }}>
            {getConventionArticles(language).map(item => (
              <Link
                key={item.slug}
                href={{ pathname: '/[slug]', params: { slug: item.slug } }}
                style={[styles.link, { fontSize: bodyFont, lineHeight: bodyFont * 1.60 }]}
              >{getLocalizedConvention(item, language).title}</Link>
            ))}
          </View>
        </>
      )}
      <PublicPageBack articleSlug={article?.slug} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#faf4ee' },
  title: { color: '#0a3c6a', fontWeight: '800' },
  heading: { color: '#0a3c6a', fontWeight: '700' },
  body: { color: '#4b7198' },
  link: { color: '#0a3c6a', textDecorationLine: 'underline' },
});
