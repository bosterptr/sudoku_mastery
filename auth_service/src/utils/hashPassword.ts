import bcrypt from 'bcryptjs';

const hashPassword = (password: string) => bcrypt.hash(password, 12);

export { hashPassword as default };
