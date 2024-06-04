import { forgotPassword } from 'app/core/api/user';
import { Page } from 'app/features/page';
import { assertUnreachable } from 'app/utils/assertUnreachable';
import { useState } from 'react';
import ForgotPasswordForm from './components/auth-forgot-password-form';
import ForgotPasswordSuccess from './components/auth-forgot-password-success';
import { Root } from '../styles';

// eslint-disable-next-line no-shadow
enum Step {
  Form,
  Success,
}

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(Step.Form);

  const handleSubmit = async (email: string) => {
    await forgotPassword({ email });
    setStep(Step.Success);
  };
  const renderStep = () => {
    switch (step) {
      case Step.Form:
        return <ForgotPasswordForm onSubmit={handleSubmit} />;
      case Step.Success:
        return <ForgotPasswordSuccess />;
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
export default ForgotPasswordPage;
