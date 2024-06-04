import InputField from 'app/components/form-inputs/Input';
import { IUser } from 'app/core/api/types/API_User';
import { useAppDispatch } from 'app/core/app_store';
import UserThunks from 'app/core/redux/modules/user/thunks';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Props {
  user: IUser;
}

export const UserProfilePersonalInfo = ({ user }: Props) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [displayName, setDisplayName] = useState(user.displayName);
  const handleDisplayNameBlur = async () => {
    dispatch(UserThunks.thunkUpdateUser({ id: user.id, displayName }));
  };
  if (user) {
    return (
      <Root>
        <InputField
          type="text"
          name="displayName"
          autoComplete="displayName"
          onChange={setDisplayName}
          value={displayName}
          label={intl.formatMessage({ defaultMessage: 'Display Name' })}
          onBlur={handleDisplayNameBlur}
        />
      </Root>
    );
  }
  return <FormattedMessage defaultMessage="User does not exist" />;
};
