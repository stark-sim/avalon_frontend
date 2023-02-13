import Merlin from "../assets/cards/Merlin.svg";
import Morgana from "../assets/cards/Morgana.svg";
import Agravain from "../assets/cards/Agravain.svg";
import Percival from "../assets/cards/Percival.svg";
import Mordred from "../assets/cards/Mordred.svg";
import Galahad from "../assets/cards/Galahad.svg";
import Bedivere from "../assets/cards/Bedivere.svg";
import Bors from "../assets/cards/Bors.svg";
import Ector from "../assets/cards/Ector.svg";
import Gawain from "../assets/cards/Gawain.svg";
import Kay from "../assets/cards/Kay.svg";
import Oberon from "../assets/cards/Oberon.svg";
import Kevin from "../assets/cards/Kevin.png";
import Stuart from "../assets/cards/Stuart.png";
import Bob from "../assets/cards/Bob.png";

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
    case "Percival":
      return Percival;
    case "Mordred":
      return Mordred;
    case "Oberon":
      return Oberon;
    case "Galahad":
      return Galahad;
    case "Bedivere":
      return Bedivere;
    case "Bors":
      return Bors;
    case "Ector":
      return Ector;
    case "Gawain":
      return Gawain;
    case "Kay":
      return Kay;
    case "Kevin":
      return Kevin;
    case "Stuart":
      return Stuart;
    case "Bob":
      return Bob;
    default:
      return "";
  }
};

// 头像颜色，标记红蓝
let redAvatar = {
  "border-color": "red",
  "border-width": "1px",
  "border-style": "solid",
};
let blueAvatar = {
  "border-color": "blue",
  "border-width": "1px",
  "border-style": "solid",
};
let questionAvatar = {
  "border-color": "red red blue blue",
  "border-width": "1px",
  "border-style": "solid",
};
const avatarStyle = (roleType: string | undefined) => {
  if (roleType == "RED") {
    return redAvatar;
  } else if (roleType == "BLUE") {
    return blueAvatar;
  } else if (roleType == "UNKNOWN") {
    return questionAvatar;
  }
};

export { getAvatarPathByUserIDAndNumber, getAvatarPathByCardName, avatarStyle };
