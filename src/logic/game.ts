
const GetAvatarPathByUserIDAndNumber = (userID: string, number: number): string => {
    // 同一天同一人在同一个号码上头像一样
    const now = new Date()
    const day = now.getDay()
    const avatarPathList = [
        "src/assets/avatars/astronaut.svg",
        "src/assets/avatars/buddhist-monk.svg",
        "src/assets/avatars/chief.svg",
        "src/assets/avatars/cowboy.svg",
        "src/assets/avatars/daughter.svg",
        "src/assets/avatars/elf.svg",
        "src/assets/avatars/father.svg",
        "src/assets/avatars/hipster.svg",
        "src/assets/avatars/jesus.svg",
        "src/assets/avatars/leprechaun.svg",
        "src/assets/avatars/little-red-hood.svg",
        "src/assets/avatars/mechanic.svg",
        "src/assets/avatars/nurse.svg",
        "src/assets/avatars/pirate.svg",
        "src/assets/avatars/scientist.svg",
        "src/assets/avatars/secret-agent.svg",
    ]
    const res = (day + number + parseInt(userID.substring(16))) % avatarPathList.length
    return avatarPathList[res]
}

export {GetAvatarPathByUserIDAndNumber}