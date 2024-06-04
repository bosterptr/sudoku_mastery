import { OptionsType, zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import { useEffect } from 'react';

const loadOptions = async () => {
  const options: OptionsType = {
    dictionary: zxcvbnCommonPackage.dictionary,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    useLevenshteinDistance: true,
  };
  return options;
};

export function useZxcvbn() {
  useEffect(() => {
    const loadzxcvbn = async () => {
      const options = await loadOptions();
      zxcvbnOptions.setOptions(options);
    };
    loadzxcvbn();
  }, []);
  return zxcvbn;
}
