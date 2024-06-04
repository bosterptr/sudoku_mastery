import Grow from 'app/common/components/animations/Grow';
import { Avatar } from 'app/common/components/avatar/component';
import Portal from 'app/common/components/global-modal/Portal';
import { useClickAway } from 'app/common/hooks/use-click-away';
import { useReduxState } from 'app/common/hooks/use-redux-state';
import { PersonOutline } from 'app/common/icons/PersonOutline';
import { config } from 'app/core/App';
import { useAppDispatch } from 'app/core/app_store';
import { removeAuthCookies } from 'app/core/auth/cookies';
import SessionActions from 'app/core/redux/modules/session/actions';
import { selectCurrentUser, selectIsLoggedIn } from 'app/core/redux/modules/session/state';
import * as duration from 'app/core/themes/duration';
import * as transitions from 'app/core/themes/transitions';
import { zIndex } from 'app/core/themes/zIndex';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link, NavigateFunction } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const Backdrop = styled.div<{
  open: boolean;
  $withoutBackground?: boolean;
}>`
  -webkit-tap-highlight-color: transparent;
  ${(p) => !p.$withoutBackground && 'background-color: rgba(0, 0, 0, 0.5);'}
  align-items: center;
  display: flex;
  inset: 0;
  justify-content: center;
  opacity: ${(p) => (p.open ? 1 : 0)};
  position: fixed;
  z-index: -1;
  transition: ${transitions.create('opacity', {
    duration: duration.enteringScreen,
  })};
`;

const AnimateBackgroundIn = keyframes`
 0% {}
10% {
  box-shadow: rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
17% {
  box-shadow: rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
25% {
  box-shadow: rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
30% {
  box-shadow: rgb(0 87 242 / 20%) 15px 15px,
    rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
65% {
  box-shadow: rgb(0 87 242 / 30%) 10px 10px, rgb(0 87 242 / 20%) 15px 15px,
    rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px
}
80% {
  box-shadow: rgb(0 87 242 / 40%) 5px 5px, rgb(0 87 242 / 30%) 10px 10px, rgb(0 87 242 / 20%) 15px 15px,
    rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
90% {
  box-shadow: rgb(0 87 242 / 40%) 5px 5px, rgb(0 87 242 / 30%) 10px 10px, rgb(0 87 242 / 20%) 15px 15px,
    rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
100% {
  box-shadow: rgb(0 87 242 / 40%) 5px 5px, rgb(0 87 242 / 30%) 10px 10px, rgb(0 87 242 / 20%) 15px 15px,
    rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
`;
const AnimateBackgroundOut = keyframes`
 100% {}
80% {
  box-shadow: rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
65% {
  box-shadow: rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
40% {
  box-shadow: rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
25% {
  box-shadow: rgb(0 87 242 / 20%) 15px 15px,
    rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
17% {
  box-shadow: rgb(0 87 242 / 30%) 10px 10px, rgb(0 87 242 / 20%) 15px 15px,
    rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
10% {
  box-shadow: rgb(0 87 242 / 40%) 5px 5px, rgb(0 87 242 / 30%) 10px 10px, rgb(0 87 242 / 20%) 15px 15px,
    rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
0% {
  box-shadow: rgb(0 87 242 / 40%) 5px 5px, rgb(0 87 242 / 30%) 10px 10px, rgb(0 87 242 / 20%) 15px 15px,
    rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px;
}
`;

const AccountDropdownBackground = styled.div<{ $active: boolean }>`
  border-radius: 0.5rem;
  animation: ${(p) => (p.$active ? AnimateBackgroundIn : AnimateBackgroundOut)} 0.2s;
  /* animation-direction: ${(p) => (p.$active ? 'normal' : 'reverse')}; */
  animation-fill-mode: forwards;
  /* box-shadow: 0 1rem 2.5rem 0 rgba(10, 14, 29, 0.2), 0 1rem 5rem 0 rgba(10, 14, 29, 0.35); */
  /* box-shadow: rgb(0 87 242 / 40%) 5px 5px, rgb(0 87 242 / 30%) 10px 10px, rgb(0 87 242 / 20%) 15px 15px,
    rgb(0 87 242 / 10%) 20px 20px, rgb(0 87 242 / 5%) 25px 25px, rgb(0 0 0 / 2%) 0 22px 70px 4px; */
  position: absolute;
  right: 2.5rem;
  top: 5.625rem;
  transition: box-shadow 0.2s ease;
  width: 25rem;
  z-index: 5;
  @media screen and (max-width: 800px) {
    width: calc(100vw - 5rem);
  }
`;

const AnimateDropdownShadowIn = keyframes`
 0% {}
65% {
  box-shadow: rgb(0 87 242 / 10%) -5px -8px 30px 4px;
}
80% {
  box-shadow: rgb(0 87 242 / 20%) -5px -8px 30px 4px;
}
100% {
  box-shadow: rgb(0 87 242 / 30%) -5px -8px 30px 4px;
}
`;

const AnimateDropdownShadowOut = keyframes`
 100% {}
80% {
  box-shadow: rgb(0 87 242 / 10%) -5px -8px 30px 4px;
}
65% {
  box-shadow: rgb(0 87 242 / 20%) -5px -8px 30px 4px;
}
0% {
  box-shadow: rgb(0 87 242 / 30%) -5px -8px 30px 4px;
}
`;
const AnimateDropdownTranslateOut = keyframes`
0% {transform: translate(0, 0)}
100% {
  transform: translate(30px, 30px)
}
`;
const AnimateDropdownTranslateIn = keyframes`
100% {transform: translate(0, 0)}
0% {
  transform: translate(30px, 30px)
}
`;

const AccountDropdown = styled.div<{ $active: boolean }>`
  border-radius: 10px;
  animation:
    ${(p) => (p.$active ? AnimateDropdownTranslateIn : AnimateDropdownTranslateOut)} 0.4s ease,
    ${(p) => (p.$active ? AnimateDropdownShadowIn : AnimateDropdownShadowOut)} 0.2s ease;
  animation-fill-mode: forwards;
  display: flex;
  flex-direction: column;
  position: absolute;
  transition: translate 0.2s ease;
  width: 100%;
  position: relative;
  z-index: 5;
  @media screen and (max-width: 800px) {
    width: calc(100vw - 5rem);
  }
`;

const UserCard = styled.div`
  align-items: center;
  background-color: #1a42c0;
  background-size: cover;
  border-radius: 5px 5px 0 0;
  display: flex;
  padding: 0.5rem;
`;

const UserBadgeContainer = styled.div`
  align-items: center;
  border-radius: 4px;
  color: #0abb87 !important;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  list-style: none;
  text-align: left;
`;

const UserCardName = styled.div`
  color: #fff;
  cursor: pointer;
  flex-grow: 1;
  font-size: 1.3rem;
  font-weight: 500;
  padding-left: 1rem;
  text-align: left;
`;

const CardItemIcon = styled.div`
  height: 20px;
  width: 20px;
  vertical-align: bottom;
  margin: 0 1rem 0 0;
  transition: color 0.3s ease;
  svg {
    transition: fill 0.3s ease;
  }
`;

const CardContainer = styled.div`
  padding: 0.5rem;
  background: ${(p) => p.theme.palette.background.primary};
  border-radius: 5px;
`;

const CardItem = styled(Link)`
  align-items: center;
  border-radius: 5px;
  color: rgb(71, 73, 83);
  display: flex;
  padding: 0.5rem;
  position: relative;
  transition: background-color 0.3s ease 0s;
  &:hover {
    background-color: rgb(0 87 242);
    color: white;
    ${CardItemIcon} {
      color: white;
      svg {
        fill: white;
      }
    }
  }
`;

const CardItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CardItemDetailsTitle = styled.div`
  font-weight: 500 !important;
  text-align: left;
  transition: color 0.3s ease;
`;

const CardItemDetailsSubTitle = styled.div`
  font-weight: 300;
  text-align: left;
  transition: color 0.3s ease;
`;

const CardItemFooter = styled.div`
  align-items: center;
  border-top: 1px solid #f7f8fa;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
`;

const CardItemFooterButton = styled.div`
  align-items: center;
  background-color: #5d78ff;
  border-radius: 0.2rem;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  outline: 0 !important;
  padding: 0.5rem 1rem;
  text-decoration: none !important;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: rgb(26, 66, 192);
  }
`;
const Root = styled.div`
  position: fixed;
  z-index: ${zIndex.modal};
  inset: 0;
`;

export interface IProps {
  open: boolean;
  onClickAway: () => void;
  navigate: NavigateFunction;
}

const ProfileDropdown = ({ open, onClickAway, navigate }: IProps) => {
  const dispatch = useAppDispatch();
  const [didMount, setDidMount] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setDidMount(true);
  }, []);
  const handleClickAway = () => {
    if (didMount && open) onClickAway();
  };
  const user = useReduxState(selectCurrentUser());
  const isAuth = useSelector(selectIsLoggedIn);
  const handleRedirectToProfile = useCallback(() => {
    if (user && user.id) navigate(`/userProfile/${user.id}`);
  }, [navigate, user]);
  const logoutWithDropdown = useCallback(() => {
    navigate('/');
    dispatch(SessionActions.setSessionUser(null));
    removeAuthCookies({ config });
  }, [dispatch, navigate]);
  useClickAway(handleClickAway, containerRef);
  if (isAuth && user) {
    return (
      <Portal>
        <Root data-testid="profile-dropdown">
          <Backdrop
            data-testid="backdrop"
            open={open}
            onClick={handleClickAway}
            $withoutBackground
          />
          <Grow appear in={open}>
            <AccountDropdownBackground $active={open}>
              <AccountDropdown $active={open} ref={containerRef}>
                <UserCard>
                  <UserBadgeContainer onClick={handleRedirectToProfile}>
                    <Avatar
                      src={null}
                      size="medium"
                      style={{
                        height: '40px',
                        width: '40px',
                        fontSize: '1.5rem',
                      }}
                    >
                      {user.displayName.trim().slice(0, 1)}
                    </Avatar>
                  </UserBadgeContainer>
                  <UserCardName onClick={() => {}}>{user.displayName}</UserCardName>
                </UserCard>
                <CardContainer>
                  <CardItem to={`/userProfile/${user.id}`}>
                    <CardItemIcon>
                      <PersonOutline size="100%" />
                    </CardItemIcon>
                    <CardItemDetails>
                      <CardItemDetailsTitle>
                        <FormattedMessage defaultMessage="My profile" />
                      </CardItemDetailsTitle>
                      <CardItemDetailsSubTitle>
                        <FormattedMessage defaultMessage="Account settings and more." />
                      </CardItemDetailsSubTitle>
                    </CardItemDetails>
                  </CardItem>
                  <CardItemFooter>
                    <CardItemFooterButton onClick={logoutWithDropdown}>
                      <FormattedMessage defaultMessage="Sign out" />
                    </CardItemFooterButton>
                  </CardItemFooter>
                </CardContainer>
              </AccountDropdown>
            </AccountDropdownBackground>
          </Grow>
        </Root>
      </Portal>
    );
  }
  return null;
};
export default ProfileDropdown;
