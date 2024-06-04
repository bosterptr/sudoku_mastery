import { app } from 'app/core/App';
import { TopNav } from 'app/features/top-nav';
import { TOP_NAV_HEIGHT } from 'app/features/top-nav/constants';
import { ReactNode, useEffect } from 'react';
import styled, { css } from 'styled-components';

const ContentWithHeader = styled.div<{ $withoutTopNav: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  position: relative;
  width: 100%;
  ${(p) =>
    p.$withoutTopNav === true &&
    css`
      height: calc(100% - ${TOP_NAV_HEIGHT});
    `};
`;
export interface IPublicProps {
  title?: string;
  withoutTopNav?: boolean;
  children?: ReactNode;
}
export type Props = IPublicProps;
export const Page = ({ title, children, withoutTopNav = false }: Props) => {
  useEffect(() => {
    app.setPageTitle(title || '');
  }, [withoutTopNav, title]);
  return (
    <>
      {withoutTopNav !== true && <TopNav />}
      <ContentWithHeader $withoutTopNav={withoutTopNav}>{children}</ContentWithHeader>
    </>
  );
};
