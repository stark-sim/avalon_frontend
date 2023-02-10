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
      assassinChance
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

interface Card {
  id: string;
  role: string;
  name: string;
  red: boolean;
}

interface GameUser {
  id: string;
  gameID: string;
  user: User;
  card: Card;
  number: number;
  createdAt: Date;
}

const GET_VAGUE_GAME_USERS = gql`
  query ($req: GameRequest!) {
    getVagueGameUsers(req: $req) {
      id
      user {
        id
        name
        phone
      }
      card {
        id
        name
        role
      }
      number
      createdAt
      gameID
    }
  }
`;

const GetVagueGameUsers = (gameID: string) => {
  const { result } = useQuery(
    GET_VAGUE_GAME_USERS,
    {
      req: {
        id: gameID,
      },
    },
    {
      clientId: "default",
    }
  );
  return result;
};

const GET_GAME_USERS_WITH_CARD_BY_GAME = gql`
  query ($req: GameRequest!) {
    getGameUsersByGame(req: $req) {
      id
      user {
        id
        name
        phone
      }
      card {
        id
        name
        role
        tale
      }
      number
      createdAt
      gameID
    }
  }
`;

const GetGameUsersWithCardByGame = (gameID: string) => {
  const { result } = useQuery(
    GET_GAME_USERS_WITH_CARD_BY_GAME,
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

const ASSASSINATE = gql`
  mutation ($req: AssassinateRequest!) {
    assassinate(req: $req) {
      id
      endBy
      capacity
      theAssassinatedIds
      assassinChance
      createdAt
      updatedAt
    }
  }
`;

const Assassinate = async (gameID: string, targetIDs: string[]) => {
  const { mutate: assassinate } = useMutation(ASSASSINATE, () => ({
    variables: {
      req: {
        gameID: gameID,
        theAssassinatedIDs: targetIDs,
      },
    },
    clientId: "default",
  }));
  try {
    const response = await assassinate();
    const data = response?.data;
    return data.assassinate;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const GET_ASSASSINATION_BY_GAME = gql`
  subscription ($req: GameRequest!) {
    getAssassinationByGame(req: $req) {
      tempPickedIDs
      theAssassinatedIDs
    }
  }
`;

const GetAssassinationByGame = (gameID: string, enabled: Ref<boolean>) => {
  const { result } = useSubscription(
    GET_ASSASSINATION_BY_GAME,
    () => ({
      req: {
        id: gameID,
      },
    }),
    () => ({
      clientId: "avalon",
      enabled: enabled.value,
    })
  );
  return result;
};

const GET_ONES_CARD_IN_GAME = gql`
  query ($req: GameUserRequest!) {
    getOnesCardInGame(req: $req) {
      id
      name
      role
      tale
      red
    }
  }
`;

const GetOnesCardInGame = (userID: string, gameID: string) => {
  const { result } = useQuery(
    GET_ONES_CARD_IN_GAME,
    {
      req: {
        userID: userID,
        gameID: gameID,
      },
    },
    {
      clientId: "default",
    }
  );
  return result;
};

interface OtherView {
  userID: string;
  type: string;
}

const VIEW_OTHERS_IN_GAME = gql`
  query ($req: GameUserRequest!) {
    viewOthersInGame(req: $req) {
      userID
      type
    }
  }
`;

const ViewOthersInGame = (userID: string, gameID: string) => {
  const { result } = useQuery(
    VIEW_OTHERS_IN_GAME,
    {
      req: {
        userID: userID,
        gameID: gameID,
      },
    },
    { clientId: "default" }
  );
  return result;
};

export {
  GetRoomOngoingGame,
  CreateGame,
  GetGameUsersByGame,
  GetVagueGameUsers,
  GetGameUsersWithCardByGame,
  Assassinate,
  GetAssassinationByGame,
  GetOnesCardInGame,
  ViewOthersInGame,
};
export type { GameUser, Card, OtherView };
