import User from './user.model';

const findUserById = async (id: string) => {
  const user = await User.findOne({ _id: id });

  return user || null;
};

export const userService = { findUserById };
