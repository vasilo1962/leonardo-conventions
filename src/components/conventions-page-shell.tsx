import { getPageHelpContext } from '@/lib/ai-help';
import usePlayerLanguage from '@/hooks/use-player-language';
import BackLink from '@/components/back-link';
import { Link, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import Text from '@/components/app-text';
import { getConventionArticles } from '@/lib/bridge-conventions';
import { getConventionUiCopy, getLocalizedConvention } from '@/lib/convention-translations';
import { responsiveHeightFontSize } from '@/lib/interface-scale';
import AppScreenFrame from '@/components/app-screen-frame';
import BrainathlonMenuScreen from '@/components/brainathlon-menu-screen';
import { getSharedLobbyHeadingTopGap, getSharedLobbyOuterMargin, getSharedLobbyRightZoneWidth, getSharedLobbySidebarWidth } from '@/lib/shared-lobby-width';
import { createPublicContentNavigation } from '@/shared/public-content/navigation';
import { usePublicReader } from '@/shared/public-content/use-public-reader';
import { ConventionsLanguageContext } from '@/shared/public-content/document-language';

export { usePublicDocumentLanguage as useConventionsLanguage } from '@/shared/public-content/document-language';

export default function ConventionsPageShell({ children, articleSlug, documentKind }: { children: ReactNode; articleSlug?: string; documentKind?: string }) {
  const router = useRouter();
  const { language, selectLanguage } = usePlayerLanguage();
  const rtl = language === 'ar' || language === 'he';
  const { username, canOpenTables } = usePublicReader();
  const { width, height } = useWindowDimensions();
  const showSidebar = width >= 820;
  const sidebarWidth = getSharedLobbySidebarWidth(width);
  const rightZoneWidth = getSharedLobbyRightZoneWidth(width);
  const bodyFont = responsiveHeightFontSize(height * 0.020, width, height, false);
  const outerMargin = getSharedLobbyOuterMargin(width);
  const openDestination = createPublicContentNavigation(router);

  return (
    <ConventionsLanguageContext.Provider value={{ language, selectLanguage }}>
    <AppScreenFrame
      username={username}
      helpContext={getPageHelpContext('public-content', username === 'Guest', {
        document: documentKind ?? 'conventions', article: articleSlug ?? 'index',
      })}
      onExit={() => { if (typeof window !== 'undefined') window.location.assign('https://leonardobridge.com/'); }}
      lightTheme
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {showSidebar ? (
          <View style={{ width: sidebarWidth, marginLeft: outerMargin }}>
            <BrainathlonMenuScreen
              sidebarActive="guide"
              sidebarWidth={sidebarWidth}
              onPractice={() => openDestination('solo-practice')}
              onTry={() => openDestination('practice')}

              onPartnershipPractice={() => openDestination('partnership-practice')}
              onTeachingTable={() => openDestination('teaching-table')}
              onResults={() => openDestination('history')}
              onDuel={() => openDestination('duel')}
              onOpenTables={canOpenTables ? () => openDestination('tables') : undefined}
              onSignIn={() => openDestination('sign-in')}
              onDismissMessage={() => undefined}
              busyGame={null}
              onTournaments={() => openDestination('tournaments')}
              onStatistics={() => openDestination('statistics')}
              onFederationDeals={() => openDestination('federation')}
              federationDealsEnabled
              playMessage={null}
              username={username === 'Guest' ? null : username}
            />
          </View>
        ) : null}
        <View nativeID="ai-help-public-document" style={{ flex: 1, minWidth: 0, marginRight: showSidebar ? outerMargin : 0 }}>
          {children}
        </View>
        {showSidebar && articleSlug ? (
          <ScrollView
            accessibilityLabel={getConventionUiCopy(language).conventions}
            style={{ width: rightZoneWidth, flexGrow: 0, flexShrink: 0, marginRight: outerMargin }}
            contentContainerStyle={{
              paddingTop: getSharedLobbyHeadingTopGap(height),
              paddingBottom: bodyFont * 1.40,
              gap: bodyFont * 0.35,
            }}
          >
            {getConventionArticles(language).map(article => (
              <Link
                key={article.slug}
                href={{ pathname: '/[slug]', params: { slug: article.slug } }}
                asChild
              >
                <Text
                  accessibilityRole="link"
                  accessibilityState={{ selected: article.slug === articleSlug }}
                  style={{
                    color: '#0a3c6a',
                    fontSize: bodyFont,
                    lineHeight: bodyFont * 1.60,
                    fontWeight: article.slug === articleSlug ? '800' : '400',
                    textDecorationLine: 'underline',
                    textAlign: rtl ? 'right' : 'left',
                    writingDirection: 'ltr',
                  }}
                >{getLocalizedConvention(article, language).title}</Text>
              </Link>
            ))}
          </ScrollView>
        ) : null}
      </View>
    </AppScreenFrame>
    </ConventionsLanguageContext.Provider>
  );
}


export function PublicPageBack({ articleSlug }: { articleSlug?: string }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  return <BackLink alignWithExit={width < 820} onPress={() => {
    if (router.canGoBack()) router.back();
    else if (articleSlug) router.replace('/');
    else if (typeof window !== 'undefined') window.location.assign('https://leonardobridge.com/');
  }} />;
}
