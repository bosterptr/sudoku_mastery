import { MouseEventHandler, ReactNode } from 'react';
import styled, { css } from 'styled-components';

const TabUnderline = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  transition: all 0.2s ease;
  background-color: ${(p) => p.theme.palette.border.weak};
  height: 1px;
`;

const Tab = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  ${(p) =>
    p.$active &&
    css`
      ${TabUnderline} {
        background-color: ${p.theme.palette.primary.main};
        height: 2px;
      }
    `}
  &:hover {
    ${TabUnderline} {
      background-color: ${(p) => p.theme.palette.primary.main};
      height: 2px;
    }
  }
`;

const TabLabel = styled.div<{ padding?: number; $active: boolean }>`
  cursor: pointer;
  padding: 0 ${(p) => (p.padding ? p.padding : '20')}px;
  user-select: none;
  color: ${(p) => !p.$active && p.theme.palette.text.secondary};
`;

const Text = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const TabComponent = ({
  children,
  active = false,
  onClick,
  show = true,
  padding,
}: {
  children: ReactNode;
  active: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  show?: boolean;
  padding?: number;
}) => {
  if (show) {
    return (
      <Tab onClick={onClick} $active={active}>
        <TabLabel padding={padding} $active={active}>
          <Text>{children}</Text>
          <TabUnderline />
        </TabLabel>
      </Tab>
    );
  }
  return null;
};

export default TabComponent;
