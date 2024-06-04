import { checkPasswordBreach } from 'app/core/api/pwnedpasswords';
import SHA1 from 'app/utils/SHA1';

export const getPasswordPwnedCount = async (password: string): Promise<number> => {
  let sha1pass = SHA1(password);
  sha1pass = sha1pass.toUpperCase();
  const response = await checkPasswordBreach(sha1pass);
  let pwnedcount = '0';

  if (!('error' in response)) {
    const passlist = response.data.split('\n');
    const subsha1pass = sha1pass.substring(5);
    for (let i = 0, passlistLength = passlist.length; i < passlistLength; i += 1) {
      if (subsha1pass === passlist[i].split(':')[0]) {
        pwnedcount = passlist[i].split(':')[1].replace(/\\r/g, '');
      }
    }
  }
  return parseInt(pwnedcount, 10);
};
