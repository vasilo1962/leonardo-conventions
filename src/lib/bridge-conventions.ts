import registry from '@/generated/conventions.json';
import type { InfoLanguage } from '@/lib/info-popup-translations';
export type ConventionSection = { heading?: string; lines: string[] };
export type ConventionArticle = { slug: string; conventionId: string; language: InfoLanguage; group: string; title: string; sections: ConventionSection[] };
export const conventionArticles = registry.articles as ConventionArticle[];
export const conventionSlugAliases: Record<string,string> = registry.redirects;
export function getConvention(slug: string | string[] | undefined) {
  const value = Array.isArray(slug) ? slug[0] : slug;
  return value ? conventionArticles.find(item => item.slug === (conventionSlugAliases[value] ?? value)) : undefined;
}
export function getConventionArticles(language: InfoLanguage) { return conventionArticles.filter(item => item.language === language); }
