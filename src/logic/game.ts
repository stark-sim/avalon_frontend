import Merlin from "../assets/cards/Merlin.svg";
import Morgana from "../assets/cards/Morgana.svg";
import Agravain from "../assets/cards/Agravain.svg";

import astronaut from "../assets/avatars/astronaut.svg";
import buddhistMonk from "../assets/avatars/buddhist-monk.svg";
import chief from "../assets/avatars/chief.svg";
import cowboy from "../assets/avatars/cowboy.svg";
import daughter from "../assets/avatars/daughter.svg";
import elf from "../assets/avatars/elf.svg";
import father from "../assets/avatars/father.svg";
import hipster from "../assets/avatars/hipster.svg";
import jesus from "../assets/avatars/jesus.svg";
import leprechaun from "../assets/avatars/leprechaun.svg";
import littleRedHood from "../assets/avatars/little-red-hood.svg";
import mechanic from "../assets/avatars/mechanic.svg";
import nurse from "../assets/avatars/nurse.svg";
import pirate from "../assets/avatars/pirate.svg";
import scientist from "../assets/avatars/scientist.svg";
import secretAgent from "../assets/avatars/secret-agent.svg";

const getAvatarPathByUserIDAndNumber = (
  userID: string,
  number: number
): string => {
  // 同一天同一人在同一个号码上头像一样
  const now = new Date();
  const day = now.getDay();
  const avatarPathList = [
    astronaut,
    buddhistMonk,
    chief,
    cowboy,
    daughter,
    elf,
    father,
    hipster,
    jesus,
    leprechaun,
    littleRedHood,
    mechanic,
    nurse,
    pirate,
    scientist,
    secretAgent,
  ];
  const res =
    (day + number + parseInt(userID.substring(16))) % avatarPathList.length;
  return avatarPathList[res];
};

const getAvatarPathByCardName = (cardName: string): string => {
  switch (cardName) {
    case "Merlin":
      return Merlin;
    case "Morgana":
      return Morgana;
    case "Agravain":
      return Agravain;
    default:
      return "";
  }
};

export { getAvatarPathByUserIDAndNumber, getAvatarPathByCardName };
