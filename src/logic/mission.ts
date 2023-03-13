import { Ref } from "vue";
import { Mission } from "../gqls/mission";
import missionOne from "../assets/missions/_1.svg";
import missionTwo from "../assets/missions/_2.svg";
import missionThree from "../assets/missions/_3.svg";
import missionFour from "../assets/missions/_4.svg";
import missionFive from "../assets/missions/_5.svg";

const shouldUpdateCurrenMission = (
  currentMission: Ref<Mission | undefined>,
  tempMission: any
): boolean => {
  if (currentMission.value!.status == "picking") {
    if (
      tempMission.status == "voting" &&
      currentMission.value!.sequence == tempMission.sequence
    ) {
      return true;
    } else {
      return false;
    }
  } else if (currentMission.value!.status == "voting") {
    if (
      tempMission.status == "acting" &&
      currentMission.value!.sequence == tempMission.sequence
    ) {
      return true;
    } else {
      return false;
    }
  } else if (currentMission.value!.status == "acting") {
    if (
      (tempMission.status == "closed" || tempMission.status == "delayed") &&
      currentMission.value!.sequence == tempMission.sequence
    ) {
      return true;
    } else {
      return false;
    }
  } else if (currentMission.value!.status == "closed") {
    if (currentMission.value!.sequence + 1 == tempMission.sequence) {
      return true;
    } else {
      return false;
    }
  } else if (currentMission.value!.status == "delayed") {
    if (
      currentMission.value!.sequence == tempMission.sequence &&
      tempMission.status != "delayed"
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

const getMissionAvatarPath = (sequence: number): string => {
  switch (sequence) {
    case 1:
      return missionOne;
    case 2:
      return missionTwo;
    case 3:
      return missionThree;
    case 4:
      return missionFour;
    case 5:
      return missionFive;
    default:
      return "";
  }
};

const getDefaultMissionCapacity = (sequence: number, usersCount: number): number => {
  console.log(usersCount)
  if (usersCount < 5) {
    return 0
  }
  switch (usersCount) {
    case 5: {
      switch (sequence) {
        case 1: return 2
        case 2: return 3
        case 3: return 2
        case 4: return 3
        case 5: return 3
      }
    }
    case 6: {
      switch (sequence) {
        case 1: return 2
        case 2: return 3
        case 3: return 4
        case 4: return 3
        case 5: return 4
      }
    }
    case 7: {
      switch (sequence) {
        case 1: return 2
        case 2: return 3
        case 3: return 3
        case 4: return 4
        case 5: return 4
      }
    }
    case 8: {
      switch (sequence) {
        case 1: return 3
        case 2: return 4
        case 3: return 4
        case 4: return 5
        case 5: return 5
      }
    }
    case 9: {
      switch (sequence) {
        case 1: return 3
        case 2: return 4
        case 3: return 4
        case 4: return 5
        case 5: return 5
      }
    }
    case 10: {
      switch (sequence) {
        case 1: return 3
        case 2: return 4
        case 3: return 4
        case 4: return 5
        case 5: return 5
      }
    }
    default: {
      switch (sequence) {
        case 1: return 3
        case 2: return 4
        case 3: return 4
        case 4: return 5
        case 5: return 5
        default: return 0
      }
    }
  }
}

export { shouldUpdateCurrenMission, getMissionAvatarPath, getDefaultMissionCapacity };
