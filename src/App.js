import React, { useState } from "react";
import FacebookLogin from "react-facebook-login";
import User from "./User";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [userID, setUserID] = useState("");
  const [postDataClicked, setPostDataClicked] = useState(false);

  const responseFacebook = (response) => {
    console.log(response);
    setAccessToken(response.accessToken);
    setUserID(response.userID);
  };

  const handlePostDataClick = () => {
    setPostDataClicked(true);
  };

  return (
    <div>
      <FacebookLogin
        appId="895081459034645"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
      />
      {accessToken && <p>Access Token: {accessToken}</p>}
      {userID && <p>User ID: {userID}</p>}

      <User accessToken={accessToken} userID={userID} />
    </div>
  );
}

export default App;
