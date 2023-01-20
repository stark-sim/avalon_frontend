import { useMutation, useQuery, useSubscription } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { Ref } from "vue";

const GET_ROOM_ONGOING_GAME = gql`
  subscription ($req: RoomRequest!) {
    getRoomOngoingGame(req: $req) {
      id
      endBy
      capacity
      createdAt
    }
  }
`;

const GetRoomOngoingGame = (roomID: string, enabled: Ref<boolean>) => {
  const { result } = useSubscription(
    GET_ROOM_ONGOING_GAME,
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

const CREATE_GAME = gql`
  mutation ($req: RoomRequest!) {
    createGame(req: $req) {
      id
      endBy
      capacity
      createdAt
    }
  }
`;

const CreateGame = async (roomID: string) => {
  const {mutate: createGame} = useMutation(
    CREATE_GAME,
    () => ({
      variables: {
        req: {
          id: roomID
        }
      },
      clientId: "default"
    })
  )
  try {
    const response = await createGame()
    const data = response?.data
    return data.createGame;
  } catch (error) {
    console.log(error)
    return null
  }
}

export { GetRoomOngoingGame, CreateGame };
