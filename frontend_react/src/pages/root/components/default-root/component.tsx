import { GlobalStyle } from 'app/pages/root/components/default-root/styles';
import { DefaultRootRouter } from 'app/pages/root/components/default-root-router';

export function DefaultRoot() {
  return (
    <>
      <GlobalStyle />
      <DefaultRootRouter />
    </>
  );
}
