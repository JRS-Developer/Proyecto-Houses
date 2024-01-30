import * as bcrypt from 'bcrypt';

export const HASH_ROUNDS = 10;

export const passwordHashEncrypt = async (
  password: string,
): Promise<string> => {
  const hash = bcrypt.hashSync(password, HASH_ROUNDS);
  return hash;
};
