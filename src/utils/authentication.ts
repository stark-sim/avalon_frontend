function getUserToken(): string | null {
  let userTokenString = localStorage.getItem("userID");
  if (userTokenString != null) {
    // 检查过期
    // 1 min
    let userTokenObj = JSON.parse(userTokenString);
    console.log(userTokenObj);
    if (userTokenObj.createdAt + 60000 < new Date().getTime()) {
      return null;
    } else {
      return userTokenObj.userID;
    }
  } else {
    return null;
  }
}

function setUserToken(userID: string) {
  console.log("setUserToken", userID);
  let userTokenObj = {
    userID: userID,
    createdAt: new Date().getTime(),
  };
  let userTokenString = JSON.stringify(userTokenObj);
  console.log(userTokenString);
  localStorage.setItem("userID", userTokenString);
}

function deleteUserToken() {
  localStorage.removeItem("userID");
}

export { getUserToken, setUserToken, deleteUserToken };
