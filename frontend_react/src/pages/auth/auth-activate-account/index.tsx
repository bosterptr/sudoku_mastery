import { PageError } from 'app/common/components/page-error';
import { LoadingSpinner } from 'app/common/components/spinner';
import { activateAccount } from 'app/core/api/user';
import { Page } from 'app/features/page';
import { assertUnreachable } from 'app/utils/assertUnreachable';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AccountActivationSuccess from './components/auth-activate-account-success';
import AccountActivationError from './components/auth-activate-account-success-error';
import { Root } from '../styles';

// eslint-disable-next-line no-shadow
enum Step {
  Error,
  Loading,
  Success,
}

const ActivateAccountPage = () => {
  const { token } = useParams();
  const [step, setStep] = useState(Step.Loading);
  useEffect(() => {
    const activateAccountFunc = async () => {
      if (token) {
        const response = await activateAccount({ token });
        if (response.status === 201) setStep(Step.Success);
        else setStep(Step.Error);
      }
    };
    activateAccountFunc();
  }, [token]);

  if (!token) return <PageError />;
  const renderStep = () => {
    switch (step) {
      case Step.Success:
        return <AccountActivationSuccess />;
      case Step.Error:
        return <AccountActivationError />;
      case Step.Loading:
        return <LoadingSpinner />;
      default: {
        return assertUnreachable(step);
      }
    }
  };
  return (
    <Page withoutTopNav>
      <Root>{renderStep()}</Root>
    </Page>
  );
};

export default ActivateAccountPage;
