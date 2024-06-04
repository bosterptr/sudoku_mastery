import { PageError } from 'app/common/components/page-error';
import { config, logger } from 'app/core/App';
import { changePasswordWithToken } from 'app/core/api/user';
import { useAppDispatch } from 'app/core/app_store';
import { saveUserCookie } from 'app/core/auth/cookies';
import SessionActions from 'app/core/redux/modules/session/actions';
import { Page } from 'app/features/page';
import { PATH_AUTH_SIGN_IN } from 'app/pages/paths';
import { assertUnreachable } from 'app/utils/assertUnreachable';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NewPasswordForm from './components/auth-new-password-form';
import WrongTokenComponent from './components/auth-new-password-wrong-token';
import { Card, Root } from '../styles';

// eslint-disable-next-line no-shadow
enum Step {
  Form,
  WrongToken,
}

const NewPasswordPage = () => {
  // TODO: extract email from the token
  const email = '';
  const [step, setStep] = useState(Step.Form);
  const navigate = useNavigate();
  const { token } = useParams();
  const dispatch = useAppDispatch();
  if (!token) return <PageError />;
  const handleSubmit = async (password: string) => {
    const response = await changePasswordWithToken({ password, token });
    if ('error' in response.data) {
      setStep(Step.WrongToken);
    } else {
      dispatch(SessionActions.setSessionUser(response.data.user));
      saveUserCookie(
        response.data.accessToken.token,
        response.data.accessToken.exp,
        response.data.refreshToken.exp,
        response.data.user,
        { config, logger },
      );
    }
  };
  const handleMoveBack = () => {
    navigate(PATH_AUTH_SIGN_IN);
  };
  const renderStep = () => {
    switch (step) {
      case Step.Form:
        return <NewPasswordForm email={email} onSubmit={handleSubmit} />;
      case Step.WrongToken:
        return <WrongTokenComponent onMoveBack={handleMoveBack} />;
      default: {
        return assertUnreachable(step);
      }
    }
  };
  return (
    <Page withoutTopNav>
      <Root>
        <Card>{renderStep()}</Card>
      </Root>
    </Page>
  );
};

export default NewPasswordPage;
