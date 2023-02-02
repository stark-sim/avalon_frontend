import { useSubscription } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { Ref } from "vue";

const GET_MISSIONS_BY_GAME = gql`
  subscription ($req: GameRequest!) {
    getMissionsByGame(req: $req) {
      id
      sequence
      status
      createdAt
      failed
      gameID
      capacity
      leaderID
      protected
    }
  }
`;

const GetMissionsByGame = (gameID: string, enabled: Ref<boolean>) => {
  const { result } = useSubscription(
    GET_MISSIONS_BY_GAME,
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

interface Mission {
  id: string;
  gameID: string;
  sequence: number;
  status: string;
  failed: boolean;
  capacity: number;
  leaderID: string;
  protected: boolean;
  createdAt: Date;
}

export { GetMissionsByGame };
export type {Mission};
