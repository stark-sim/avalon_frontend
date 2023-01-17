function getUserToken(): string {
  let userTokenString = localStorage.getItem("userID");
  if (userTokenString != null) {
    // 检查过期
    // 1 min
    let userTokenObj = JSON.parse(userTokenString);
    if (userTokenObj.createdAt + 60000 < new Date().getTime()) {
      return "";
    } else {
      return userTokenObj.userID;
    }
  } else {
    return "";
  }
}

function setUserToken(userID: string) {
  let userTokenObj = {
    userID: userID,
    createdAt: new Date().getTime(),
  };
  let userTokenString = JSON.stringify(userTokenObj);
  localStorage.setItem("userID", userTokenString);
}

function deleteUserToken() {
  localStorage.removeItem("userID");
}

export { getUserToken, setUserToken, deleteUserToken };
