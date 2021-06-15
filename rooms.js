import { v4 as uuid } from 'uuid';

export let rooms = [];

export const createRoom = (user1ID, user2ID) => {
  console.log('generating new room');
  const room = {
    roomID: user1ID + user2ID,
    messages: [],
  };
  rooms.push(room);
  return room;
};

export const checkIfRoomExists = (user1ID, user2ID) => {
  console.log('checking if room exists');
  let existingRoom = rooms.find(room => {
    return (
      room.roomID === user1ID + user2ID || room.roomID === user2ID + user1ID
    );
  });

  console.log('exist', existingRoom);
  if (existingRoom === undefined) {
    console.log('creating a new room');
    existingRoom = createRoom(user1ID, user2ID);
  } else console.log('already found a existing room');

  return existingRoom;
};

export const addMessageToRoom = (roomID, senderID, message) => {
  console.log('adding message to room');
  let room = rooms.find(room => {
    return room.roomID === roomID;
  });
  room.messages.push({
    senderID: senderID,
    message: message,
    time: Date.now(),
  });
  return room;
};

export const readMessagesFromRoom = roomID => {
  const room = rooms.find(room => roomID === room.roomID);
  return room.messages;
};
