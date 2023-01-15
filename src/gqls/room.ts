import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

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

const JoinRoom = async (userID: string, roomID: string): Promise<string> => {
  const { mutate: joinRoom } = useMutation(JOIN_ROOM, () => ({
    variables: {
      req: {
        userID: userID,
        roomID: roomID,
      },
    },
    clientId: "default",
  }));
  // 定义返回结果
  let roomUserID = "";
  try {
    // 同步操作
    const response = await joinRoom()
    const data = response?.data
    roomUserID = data.joinRoom.id
  } catch (error) {
    console.log(error)
  }
  return roomUserID
}

export { JoinRoom };
