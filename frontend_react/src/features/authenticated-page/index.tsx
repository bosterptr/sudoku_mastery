import { useReduxState } from 'app/common/hooks/use-redux-state';
import { selectCurrentUserId } from 'app/core/redux/modules/session/state';
import { Page, IPublicProps as PagePublicProps } from 'app/features/page';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = Pick<PagePublicProps, 'title' | 'children'>;

export const AuthenticatedPage = ({ title, children }: Props) => {
  const navigate = useNavigate();
  const currentUserId = useReduxState((state) => selectCurrentUserId(state));
  useEffect(() => {
    if (!currentUserId) navigate('/auth/signin');
  }, [currentUserId, navigate]);
  if (!currentUserId) {
    return null;
  }
  return <Page title={title}>{children}</Page>;
};
