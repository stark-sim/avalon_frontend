import { useMutation, useQuery, useSubscription } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { Ref } from "vue";

const GET_JOINED_ROOM = gql`
  query ($req: UserRequest!) {
    getJoinedRoom(req: $req) {
      id
      name
      createdAt
    }
  }
`;

const GetJoinedRoom = (userID: string) => {
  const { result } = useQuery(
    GET_JOINED_ROOM,
    {
      req: {
        id: userID,
      },
    },
    {
      fetchPolicy: "no-cache",
      clientId: "default",
    }
  );
  return result;
};

const JOIN_ROOM = gql`
  mutation ($req: CreateRoomUserInput!) {
    joinRoom(req: $req) {
      id
      roomID
      userID
      createdAt
    }
  }
`;

const JoinRoom = async (userID: string, roomID: string): Promise<any> => {
  const { mutate: joinRoom } = useMutation(JOIN_ROOM, () => ({
    variables: {
      req: {
        userID: userID,
        roomID: roomID,
      },
    },
    clientId: "default",
  }));
  try {
    // 同步操作
    const response = await joinRoom();
    const data = response?.data;
    return data.joinRoom;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const CREATE_ROOM = gql`
  mutation ($req: CreateRoomInput!) {
    createRoom(req: $req) {
      id
      name
      createdBy
    }
  }
`;

const CreateRoom = async (roomName: string): Promise<string> => {
  const { mutate: createRoom } = useMutation(CREATE_ROOM, () => ({
    variables: {
      req: {
        name: roomName,
      },
    },
    clientId: "default",
  }));
  let roomID = "";
  try {
    const response = await createRoom();
    const data = response?.data;
    roomID = data.createRoom.id;
    console.log(roomID);
  } catch (error) {
    console.log(error);
  }
  return roomID;
};

interface User {
  id: string;
  name: string;
  phone: string;
}

interface RoomUser {
  id: string;
  roomID: string;
  user: User;
  createdAt: Date;
  host: boolean;
}

const GET_ROOM_USERS = gql`
  subscription ($req: RoomRequest) {
    getRoomUsers(req: $req) {
      id
      user {
        id
        name
        phone
      }
      roomID
      createdAt
      host
    }
  }
`;

const GetRoomUsers = (roomID: string, enabled: Ref<boolean>) => {
  const { result } = useSubscription(
    GET_ROOM_USERS,
    () => ({
      req: {
        id: roomID,
      },
    }),
    () => ({
      clientId: "avalon",
      enabled: enabled.value,
    })
  );
  return result;
};

const LEAVE_ROOM = gql`
  mutation ($req: CreateRoomUserInput!) {
    leaveRoom(req: $req) {
      id
      userID
      roomID
      createdAt
      updatedAt
    }
  }
`;

const LeaveRoom = async (userID: string, roomID: string) => {
  const { mutate: leaveRoom } = useMutation(LEAVE_ROOM, () => ({
    variables: {
      req: {
        userID: userID,
        roomID: roomID,
      },
    },
    clientId: "default",
  }));
  try {
    const response = await leaveRoom();
    const data = response?.data.leaveRoom;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const GET_GAMES = gql`
  query {
    cards {
      id
      name
      role
      tale
      red
    }
  }
`;

const GetGames = () => {
  const { result } = useQuery(GET_GAMES, null, {
    clientId: "default",
  });
  return result;
};

export {
  JoinRoom,
  CreateRoom,
  GetRoomUsers,
  LeaveRoom,
  GetJoinedRoom,
  GetGames,
};
export type { RoomUser, User };
