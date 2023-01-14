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

function JoinRoom(userID: string, roomID: string) {
  const { mutate: joinRoom } = useMutation(JOIN_ROOM, () => ({
    variables: {
      req: {
        userID: userID,
        roomID: roomID,
      },
    },
    clientId: "default",
  }));
  
  const res  = joinRoom()
  console.log(res)
}

export { JoinRoom };
