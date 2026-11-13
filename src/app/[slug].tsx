import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import ConventionsContent from '@/components/conventions-content';
import ConventionsPageShell from '@/components/conventions-page-shell';
import { conventionArticles, conventionSlugAliases, getConvention } from '@/lib/bridge-conventions';
export function generateStaticParams() { return [...conventionArticles.map(article => article.slug), ...Object.keys(conventionSlugAliases)].map(slug => ({slug})); }
export default function ConventionPage() {
  const {slug} = useLocalSearchParams<{slug:string}>();
  const article = getConvention(slug);
  if (!article) return null;
  const url = 'https://leonardobridge.com/conventions/' + article.slug;
  const title = article.title + ' | Leonardo Bridge';
  const description = (article.sections[0]?.lines[0] ?? article.title).slice(0,155);
  return <><Head><title>{title}</title><meta name="description" content={description} /><link rel="canonical" href={url} /><meta property="og:title" content={title} /><meta property="og:description" content={description} /><meta property="og:url" content={url} />
    {conventionArticles.filter(item => item.conventionId === article.conventionId).map(item => <link key={item.language} rel="alternate" hrefLang={item.language} href={'https://leonardobridge.com/conventions/' + item.slug} />)}
    </Head><ConventionsPageShell articleSlug={article.slug}><ConventionsContent article={article} /></ConventionsPageShell></>;
}
