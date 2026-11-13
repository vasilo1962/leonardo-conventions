import { useSyncExternalStore } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPlayerInfoLanguage, getPlayerInfoLanguageRevision, selectPlayerInfoLanguage, subscribePlayerInfoLanguage, type InfoLanguage } from '@/lib/info-popup-translations';
import { getConvention, getConventionArticles } from '@/lib/bridge-conventions';
const getServerLanguage = () => 'el' as const;
const getServerRevision = () => 0;
export default function usePlayerLanguage() {
  const { slug, lang } = useLocalSearchParams<{slug?:string;lang?:string}>();
  const router = useRouter();
  const saved = useSyncExternalStore(subscribePlayerInfoLanguage, getPlayerInfoLanguage, getServerLanguage);
  const revision = useSyncExternalStore(subscribePlayerInfoLanguage, getPlayerInfoLanguageRevision, getServerRevision);
  const article = getConvention(slug);
  const indexLanguage = typeof lang === 'string' && getConventionArticles(lang as InfoLanguage).length ? lang as InfoLanguage : null;
  const language = article?.language ?? indexLanguage ?? saved;
  function selectLanguage(next: InfoLanguage) {
    selectPlayerInfoLanguage(next);
    const translated = article && getConventionArticles(next).find(item => item.conventionId === article.conventionId);
    if (translated) router.push({ pathname: '/[slug]', params: {slug: translated.slug} });
    else router.push({ pathname: '/', params: {lang: next} });
  }
  return {language, revision, selectLanguage};
}
