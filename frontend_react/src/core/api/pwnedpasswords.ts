import lazyAxios from './agent';

export const checkPasswordBreach = async (props: string) =>
  (await lazyAxios().getAxios()).get<string>(
    `https://api.pwnedpasswords.com/range/${props.substring(0, 5)}`,
    { withCredentials: false },
  );
