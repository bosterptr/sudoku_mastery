import { Avatar } from 'app/common/components/avatar/component';
import useLifecycle from 'app/common/hooks/use-lifecycle';
import { useReduxState } from 'app/common/hooks/use-redux-state';
import { selectCurrentUser, selectIsLoggedIn } from 'app/core/redux/modules/session/state';
import { darken } from 'app/core/themes/colorManipulator';
import { TOP_NAV_HEIGHT } from 'app/features/top-nav/constants';
import { lazy, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ProfileDropdown = lazy(
  () =>
    import(
      /* webpackChunkName: "features.top-nav.components.profile-dropdown" */ '../profile-dropdown'
    ),
);

const OptionsContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: flex-end;
  width: 100%;
`;

const SignInLink = styled(Link)`
  background: ${(p) => p.theme.palette.primary.main};
  border-radius: 1rem;
  color: ${(p) => p.theme.palette.primary.contrastText};
  cursor: pointer;
  font-weight: 600;
  margin: auto 10px;
  padding: 0.9rem 1rem;
  transition: all 0.3s ease;
  &:hover {
    border-radius: 2rem;
    color: ${(p) => darken(p.theme.palette.primary.contrastText, 0.1)};
  }
`;

const AvatarContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  margin: auto 10px;
  transition: filter 0.1s ease;
  &:hover {
    filter: drop-shadow(2px 4px 6px rgb(234 234 234 / 70%));
  }
`;

const Root = styled.nav`
  z-index: 1000;
  height: ${TOP_NAV_HEIGHT};
  flex-shrink: 0;
`;

export const UserMenu = () => {
  const navigate = useNavigate();
  const [lifecycleStage, handleOpen, handleClosePopover] = useLifecycle();
  const isAuth = useSelector(selectIsLoggedIn);
  const currentUser = useReduxState(selectCurrentUser());
  return (
    <Root>
      <OptionsContainer>
        {isAuth && currentUser && (
          <AvatarContainer onClick={handleOpen}>
            <Avatar src={null}>{currentUser.displayName.trim().slice(0, 1)}</Avatar>
          </AvatarContainer>
        )}
        {!isAuth && (
          <SignInLink to="/auth/signin">
            <FormattedMessage defaultMessage="Sign in" />
          </SignInLink>
        )}
      </OptionsContainer>
      {isAuth && lifecycleStage.isClosed === false && (
        <Suspense fallback={null}>
          <ProfileDropdown
            navigate={navigate}
            onClickAway={handleClosePopover}
            open={lifecycleStage.isOpen}
          />
        </Suspense>
      )}
    </Root>
  );
};
