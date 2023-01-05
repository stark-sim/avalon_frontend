function getUserToken() {
    let userTokenString = localStorage.getItem("userID")
    if (userTokenString != null) {
        // 检查过期
        // 1 min
        let userTokenObj = JSON.parse(userTokenString)
        console.log(userTokenObj)
        if (userTokenObj.createdAt + 60000 < new Date().getTime()) {
            return null
        } else {
            return userTokenObj.userID
        }
    } else {
        return null
    }
}

function setUserToken(userID) {
    console.log("setUserToken", userID)
    let userTokenObj = {
        userID: userID,
        createdAt: new Date().getTime()
    }
    let userTokenString = JSON.stringify(userTokenObj)
    console.log(userTokenString)
    localStorage.setItem("userID", userTokenString)
}

export {
    getUserToken, setUserToken
}