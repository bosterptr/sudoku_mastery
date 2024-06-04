import type { ZxcvbnResult } from '@zxcvbn-ts/core';

type Zxcvbn = (password: string, userInputs?: string[]) => ZxcvbnResult;
export type ZxcvbnScoreRange = 0 | 1 | 2 | 3 | 4 | 5;
const splitter = /\W+/;

// eslint-disable-next-line no-confusing-arrow
const addUnique = (seen: string[], chunk: string) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  seen.includes(chunk) ? seen : [...seen, chunk];

function scoreWordSplitter(strings: string[]) {
  const deduped = strings.reduce(addUnique, []);
  return deduped.reduce((arr, str) => str.split(splitter).reduce(addUnique, arr), deduped);
}

export const getZxcvbnScore = (
  zxcvbn: Zxcvbn,
  password: string,
  wordsToCheck: string[],
): ZxcvbnScoreRange => {
  if (!zxcvbn) return 0;
  if (password.length < 8 || wordsToCheck.includes(password)) {
    return 0;
  }
  const scoreWords = scoreWordSplitter(wordsToCheck);
  console.log(scoreWords, password, zxcvbn(password, scoreWords));
  return zxcvbn(password, scoreWords).score;
};

export const checkIfPasswordPassesComplexityRequirement = (
  zxcvbn: Zxcvbn | undefined,
  password: string,
  wordsToCheck: string[],
): boolean => {
  if (!zxcvbn) return false;
  const score = getZxcvbnScore(zxcvbn, password, wordsToCheck);
  if (score < 2) return false;
  return true;
};
