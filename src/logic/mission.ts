import { Ref } from "vue";
import { Mission } from "../gqls/mission";

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

export {shouldUpdateCurrenMission}