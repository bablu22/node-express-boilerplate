import User from './user.model';

const findUserById = async (id: string) => {
  const user = await User.findOne({ _id: id });

  return user || null;
};

const createUser = async (data: any) => {
  const user = await User.create(data);

  return user;
};

export const userService = { findUserById, createUser };
