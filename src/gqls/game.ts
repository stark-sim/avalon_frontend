import { useMutation, useQuery, useSubscription } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { Ref, watch } from "vue";
import { User } from "./room";

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
  mutation ($req: CreateGameRequest!) {
    createGame(req: $req) {
      id
      endBy
      capacity
      createdAt
    }
  }
`;

const CreateGame = async (roomID: string) => {
  const { mutate: createGame } = useMutation(CREATE_GAME, () => ({
    variables: {
      req: {
        roomID: roomID,
      },
    },
    clientId: "default",
  }));
  try {
    const response = await createGame();
    const data = response?.data;
    return data.createGame;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const GET_GAME_USERS_BY_GAME = gql`
  query ($req: GameRequest!) {
    getGameUsersByGame(req: $req) {
      id
      user {
        id
        name
        phone
      }
      number
      createdAt
      gameID
    }
  }
`;

const GetGameUsersByGame = (gameID: string) => {
  const { result } = useQuery(
    GET_GAME_USERS_BY_GAME,
    () => ({
      req: {
        id: gameID,
      },
    }),
    {
      clientId: "default",
    }
  );
  return result;
};

interface GameUser {
  id: string;
  gameID: string;
  user: User;
  number: number;
  createdAt: Date;
}

export { GetRoomOngoingGame, CreateGame, GetGameUsersByGame };
export type { GameUser };
