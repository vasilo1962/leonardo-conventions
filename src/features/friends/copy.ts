import friendRows from '../../../server/friend-copy-rows.json';
import type { InfoLanguage } from '@/lib/info-popup-translations';

export const friendCopyKeys = ['title','search','hint','requests','sent','add','accept','reject','cancel','loading','failed','retry','requestNotice','duelNotice','tableNotice','wait','acceptedNotice'] as const;
export type FriendCopy = Record<typeof friendCopyKeys[number], string>;
export const friendCopyRows: Record<InfoLanguage, string> = friendRows;

export function getFriendCopy(language: InfoLanguage): FriendCopy {
  const values = friendCopyRows[language].split('|');
  return Object.fromEntries(friendCopyKeys.map((key, index) => [key, values[index]])) as FriendCopy;
}

export function getFriendRequestMessage(language: InfoLanguage, username: string): string {
  return `${getFriendCopy(language).requestNotice}\n${username}`;
}


export function getFriendAcceptanceMessage(language: InfoLanguage, username: string): string {
  return getFriendCopy(language).acceptedNotice.replace('{username}', () => username);
}
