import { useMutation, useQuery, useSubscription } from "@vue/apollo-composable";
import { mutable } from "element-plus/es/utils";
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

const PICK_SQUADS = gql`
  mutation PickSquads($req: [CreateSquadInput!]!) {
    pickSquads(req: $req) {
      id
      userID
      missionID
      createdAt
      rat
      acted
    }
  }
`;

const PickSquads = async (pickedUserIDs: Ref<string[]>, missionID: string) => {
  let req: { userID: string; missionID: string }[] = [];
  for (let i = 0; i < pickedUserIDs.value.length; i++) {
    req.push({
      userID: pickedUserIDs.value[i],
      missionID: missionID,
    });
  }
  console.log(req);
  const { mutate: pickSquads } = useMutation(PICK_SQUADS, () => ({
    variables: {
      req: req,
    },
    clientId: "default",
  }));
  try {
    // 同步操作
    const response = await pickSquads();
    const data = response?.data;
    return data.pickSquads;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const GET_VOTE_IN_MISSION = gql`
  query GetVoteInMission($req: VoteWhereInput!) {
    getVoteInMission(req: $req) {
      id
      userID
      createdAt
      missionID
      voted
      pass
    }
  }
`;

const GetVoteInMission = (userID: string, missionID: string) => {
  const { result } = useQuery(
    GET_VOTE_IN_MISSION,
    {
      req: {
        userID: userID,
        missionID: missionID,
      },
    },
    {
      clientId: "default",
    }
  );
  return result;
};

interface Vote {
  id: string;
  missionID: string;
  userID: string;
  createdAt: Date;
  voted: boolean;
  pass: boolean;
}

const VOTE = gql`
  mutation Vote($req: VoteRequest!) {
    vote(req: $req) {
      id
      userID
      missionID
      pass
      voted
      createdAt
    }
  }
`;

const VoteIt = async (pass: boolean, voteID: string) => {
  const { mutate: vote } = useMutation(VOTE, () => ({
    variables: {
      req: {
        pass: pass,
        voteID: voteID,
      },
    },
    clientId: "default",
  }));
  try {
    const response = await vote();
    const data = response?.data;
    return data.vote;
  } catch (error) {
    console.log(error);
    return null;
  }
};

interface Squad {
  id: string;
  createdAt: Date;
  missionID: string;
  userID: string;
  rat: boolean;
  acted: boolean;
}

const GET_SQUAD_IN_MISSION = gql`
  query GetSquadInMission($req: SquadWhereInput!) {
    getSquadInMission(req: $req) {
      id
      createdAt
      missionID
      userID
      rat
      acted
    }
  }
`;

const GetSquadInMission = (userID: string, missionID: string) => {
  const { result } = useQuery(
    GET_SQUAD_IN_MISSION,
    {
      req: {
        userID: userID,
        missionID: missionID,
      },
    },
    {
      clientId: "default",
    }
  );
  return result;
};

const ACT = gql`
  mutation Act($req: ActRequest!) {
    act(req: $req) {
      id
      createdAt
      missionID
      userID
      rat
      acted
    }
  }
`;

const ActIt = async (rat: boolean, squadID: string) => {
  const { mutate: act } = useMutation(ACT, () => ({
    variables: {
      req: {
        rat: rat,
        squadID: squadID,
      },
    },
    clientId: "default",
  }));
  try {
    const response = await act();
    const data = response?.data;
    return data.act;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { GetMissionsByGame, PickSquads, GetVoteInMission, VoteIt, GetSquadInMission, ActIt };
export type { Mission, Vote, Squad };
