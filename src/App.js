// // import React, { useState } from "react";
// // import FacebookLogin from "react-facebook-login";
// // import User from "./User";

// // function App() {
// //   const [accessToken, setAccessToken] = useState("");
// //   const [userID, setUserID] = useState("");

// //   const responseFacebook = (response) => {
// //     console.log(response);
// //     setAccessToken(response.accessToken);
// //     setUserID(response.userID);
// //   };

// //   return (
// //     <div>
// //       <FacebookLogin
// //         appId="895081459034645"
// //         autoLoad={false}
// //         fields="name,email,picture"
// //         callback={responseFacebook}
// //       />
// //       {accessToken && <p>Access Token: {accessToken}</p>}
// //       {userID && <p>User ID: {userID}</p>}

// //       <User accessToken={accessToken} userID={userID} />
// //     </div>
// //   );
// // }

// // export default App;
// // App.js

// import React, { useState } from "react";
// import FacebookLogin from "react-facebook-login";
// import PostData from "./PostData";
// import axios from "axios";

// function App() {
//   const [accessToken, setAccessToken] = useState("");
//   const [userID, setUserID] = useState("");
//   const [pages, setPages] = useState([]);

//   const responseFacebook = (response) => {
//     console.log(response);
//     setAccessToken(response.accessToken);
//     setUserID(response.userID);
//     fetchUserPages(response.userID, response.accessToken);
//   };

//   const fetchUserPages = async (userID, accessToken) => {
//     try {
//       const response = await axios.get(
//         `https://graph.facebook.com/${userID}/accounts?fields=name,id,category,access_token,tasks&access_token=${accessToken}`
//       );
//       console.log(response.data);
//       setPages(response.data.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <FacebookLogin
//         appId="895081459034645"
//         autoLoad={false}
//         fields="name,email,picture"
//         callback={responseFacebook}
//       />
//       <PostData accessToken={accessToken} pages={pages} />
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";

function App() {
  const [fbLoaded, setFbLoaded] = useState(false);

  useEffect(() => {
    // Load the Facebook SDK asynchronously
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "323982120691311",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v12.0",
      });
      setFbLoaded(true); // Set the flag indicating that FB is loaded
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleLogin = () => {
    if (!fbLoaded) {
      // Facebook SDK is not yet loaded, so do nothing
      return;
    }

    window.FB.login(function (response) {
      if (response.authResponse) {
        console.log("Welcome!  Fetching your information.... ");
        window.FB.api("/me", function (response) {
          console.log(response);
          console.log("Good to see you, " + response.name + ".");
        });
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    });
  };

  return (
    <>
      <button onClick={handleLogin}>Login to Facebook</button>
    </>
  );
}

export default App;
