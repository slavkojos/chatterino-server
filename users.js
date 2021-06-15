export let users = [];
export const addUser = (id, name) => {
  let user = { id, name };
  users.push(user);
  return user;
};

export const getUserList = room => {
  let users = users.filter(user => user.room === room);
  let namesArray = users.map(user => user.name);
  return namesArray;
};
export const getOnlineUsers = id => {
  console.log('id to filter', id);
  const filteredUsers = users.filter(user => user.id !== id);
  return filteredUsers;
};

export const getUser = id => {
  return users.find(user => user.id === id);
};

export const removeUser = id => {
  let user = getUser(id);
  if (user) {
    users = users.filter(user => user.id !== id);
  }

  return user;
};
