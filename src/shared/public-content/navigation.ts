import type { useRouter } from 'expo-router';

export function createPublicContentNavigation(router: Pick<ReturnType<typeof useRouter>, 'push'>) {
  return (destination: string) => {
    if (typeof window !== 'undefined') {
      window.location.assign(`/?guideDestination=${destination}`);
    } else {
      router.push(`/?guideDestination=${destination}`);
    }
  };
}
