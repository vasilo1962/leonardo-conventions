import { useEffect, useState, useSyncExternalStore } from 'react';
import { getEnglishAccountPreview, getServerEnglishAccountPreview, subscribeAccountPresentation } from '@/lib/account-presentation';

const COUNTRY_URL = 'https://ipapi.co/country/';
const FEDERATION_ACCESS_STORAGE_KEY =
  'bridgeduel:federation-deals-access';
const FEDERATION_ACCESS_QUERY_PARAM = 'federationDeals';

function hasStoredFederationAccess(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.localStorage.getItem(FEDERATION_ACCESS_STORAGE_KEY)
    === 'true'
  );
}

function activateFederationAccessFromUrl(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const query = new URLSearchParams(window.location.search);

  if (query.get(FEDERATION_ACCESS_QUERY_PARAM) !== '1') {
    return false;
  }

  window.localStorage.setItem(FEDERATION_ACCESS_STORAGE_KEY, 'true');
  return true;
}

export default function useGreekFederationAccess(): boolean {
  const englishPreview = useSyncExternalStore(
    subscribeAccountPresentation, getEnglishAccountPreview, getServerEnglishAccountPreview
  );
  const [hasAccess, setHasAccess] = useState(
    () => !englishPreview && (hasStoredFederationAccess() || activateFederationAccessFromUrl())
  );

  useEffect(() => {
    if (englishPreview || hasAccess) return;
    let active = true;
    const countryRequest = hasStoredFederationAccess() || activateFederationAccessFromUrl()
      ? Promise.resolve('GR')
      : fetch(COUNTRY_URL).then(response => response.ok ? response.text() : '');

    void countryRequest.then(country => {
        if (active && !getEnglishAccountPreview() && country.trim().toUpperCase() === 'GR') {
          window.localStorage.setItem(
            FEDERATION_ACCESS_STORAGE_KEY,
            'true'
          );
          setHasAccess(true);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [hasAccess, englishPreview]);

  return !englishPreview && hasAccess;
}
