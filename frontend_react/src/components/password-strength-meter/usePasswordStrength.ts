import { zxcvbnAsync, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import { useDeferredValue, useEffect, useState } from 'react';

const options = {
  dictionary: zxcvbnCommonPackage.dictionary,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  useLevenshteinDistance: true,
};
zxcvbnOptions.setOptions(options);

export const usePasswordStrength = (password: string, userInputs?: string[]) => {
  const [result, setResult] = useState<number>(0);
  const deferredPassword = useDeferredValue(password);

  useEffect(() => {
    zxcvbnAsync(deferredPassword, userInputs).then((response) => setResult(response.score));
  }, [deferredPassword, userInputs]);

  return result;
};
