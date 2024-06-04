import Button from 'app/common/components/button';
import { House } from 'app/common/icons/House';
import { darken } from 'app/core/themes/colorManipulator';
import { TOP_NAV_HEIGHT } from 'app/features/top-nav/constants';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { UserMenu } from './components/user-menu';

const HeaderContainer = styled.div`
  backdrop-filter: blur(10px);
  background-color: ${(p) => p.theme.palette.background.primary};
  border-bottom: 1px solid ${(p) => p.theme.palette.border.weak};
  display: flex;
  height: ${TOP_NAV_HEIGHT};
  justify-content: space-between;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 10;
`;

const HeaderLeftContainer = styled.div`
  height: 100%;
  align-items: center;
  display: flex;
`;

const Title = styled.span`
  font-size: 16px;
`;

const TopNavButton = styled(Link)`
  border-radius: 1rem;
  color: ${(p) => p.theme.palette.text.primary};
  cursor: pointer;
  font-weight: 600;
  margin: auto 10px;
  padding: 0.9rem 1rem;
  transition: all 0.3s ease;
  &:hover {
    background: ${(p) => p.theme.palette.primary.light};
    border-radius: 2rem;
    color: ${(p) => darken(p.theme.palette.primary.contrastText, 0.1)};
  }
`;

const Root = styled.nav`
  z-index: 1000;
  height: ${TOP_NAV_HEIGHT};
  flex-shrink: 0;
`;

export const TopNav = () => {
  const navigate = useNavigate();
  return (
    <Root>
      <HeaderContainer>
        <HeaderLeftContainer>
          <Button category="teriary" onClick={() => navigate('/')}>
            <House size="18px" />
          </Button>
          <TopNavButton to="/create">
            <Title>
              <FormattedMessage defaultMessage="Create" />
            </Title>
          </TopNavButton>
        </HeaderLeftContainer>
        <UserMenu />
      </HeaderContainer>
    </Root>
  );
};
