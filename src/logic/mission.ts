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

export { shouldUpdateCurrenMission, getMissionAvatarPath };
