import Head from 'expo-router/head';

import { CONVENTIONS_INTRO_EL } from '@/lib/convention-translations';

import ConventionsContent from '@/components/conventions-content';
import ConventionsPageShell from '@/components/conventions-page-shell';

const PAGE_URL = 'https://leonardobridge.com/conventions';
const PAGE_TITLE = 'Συμβάσεις Bridge | Leonardo Bridge';
const PAGE_DESCRIPTION = CONVENTIONS_INTRO_EL;

export default function ConventionsIndex() {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={PAGE_URL} />
      </Head>
      <ConventionsPageShell>
        <ConventionsContent />
      </ConventionsPageShell>
    </>
  );
}
