// import React, { Component } from "react";
// import axios from "axios";

// class User extends Component {
//   state = {
//     pages: [],
//     selectedPage: null,
//     photoFile: null,
//     caption: "",
//   };

//   componentDidUpdate(prevProps) {
//     if (prevProps.userID !== this.props.userID) {
//       this.fetchUserPages();
//     }
//   }

//   fetchUserPages = async () => {
//     const { userID, accessToken } = this.props;

//     try {
//       const response = await axios.get(
//         `https://graph.facebook.com/${userID}/accounts?fields=name,id,category,access_token,tasks&access_token=${accessToken}`
//       );
//       console.log(response.data);
//       this.setState({ pages: response.data.data });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   handleInputChange = (event) => {
//     const { name, value } = event.target;
//     this.setState({
//       [name]: value,
//     });
//   };

//   handleFileChange = (event) => {
//     this.setState({
//       photoFile: event.target.files[0],
//     });
//   };

//   postPhotoToFacebook = () => {
//     const { photoFile, caption, selectedPage } = this.state;
//     const { access_token, id } = selectedPage;

//     let formData = new FormData();
//     formData.append("file", photoFile);
//     formData.append("caption", caption);

//     axios
//       .post(
//         `https://graph.facebook.com/${id}/photos?access_token=${access_token}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       )
//       .then((response) => {
//         console.log(response);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   render() {
//     const { pages, selectedPage, caption } = this.state;
//     return (
//       <div className="User">
//         {pages.map((page) => (
//           <div key={page.id}>
//             <h2>{page.name}</h2>
//             <p>{page.category}</p>
//             <p>Page ID: {page.id}</p>
//             <p>Access Token: {page.access_token}</p>
//             <p>Tasks: {page.tasks.join(", ")}</p>
//             {/* Set selectedPage when a page is clicked */}
//             <button onClick={() => this.setState({ selectedPage: page })}>
//               POST DATA
//             </button>
//           </div>
//         ))}
//         {selectedPage && (
//           <div className="Caption">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={this.handleFileChange}
//             />
//             <br />
//             <input
//               type="text"
//               name="caption"
//               value={caption}
//               onChange={this.handleInputChange}
//               placeholder="Enter caption"
//             />
//             <br />
//             <button onClick={this.postPhotoToFacebook}>
//               Post Photo to Facebook
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

// export default User;
// User.js
// User.js
// User.js
// User.js
// User.js

// import React, { useState } from "react";
// import axios from "axios";

// function User({ id, access_token }) {
//   const [message, setMessage] = useState("Photo from feed");
//   const [pictureLink, setPictureLink] = useState("");
//   const [scheduledTime, setScheduledTime] = useState("");

//   const schedulePost = () => {
//     const currentTime = new Date();
//     const scheduledTime = new Date(currentTime.getTime() + 12 * 60000); // Add 1 minute
//     setScheduledTime(scheduledTime);
//   };

//   const postToFacebookPage = () => {
//     if (!pictureLink) {
//       console.log("Please enter a picture link.");
//       return;
//     }

//     if (!scheduledTime) {
//       console.log("Please schedule the post.");
//       return;
//     }

//     const unixTimestamp = Math.floor(scheduledTime.getTime() / 1000); // Convert to UNIX timestamp

//     axios
//       .post(
//         `https://graph.facebook.com/${id}/photos`,
//         {
//           message: message,
//           url: pictureLink,
//           published: false, // Set to false to schedule the post
//           scheduled_publish_time: unixTimestamp, // Scheduled publish time
//         },
//         {
//           params: {
//             access_token: access_token,
//           },
//         }
//       )
//       .then((response) => {
//         console.log("Post scheduled successfully:", response.data);
//       })
//       .catch((error) => {
//         console.error("Error scheduling post:", error);
//       });
//   };

//   return (
//     <div className="User">
//       <div className="PostForm">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Enter message"
//         />
//         <br />
//         <input
//           type="text"
//           value={pictureLink}
//           onChange={(e) => setPictureLink(e.target.value)}
//           placeholder="Enter picture link"
//         />
//         <br />
//         <button onClick={schedulePost}>Schedule Post</button>
//         {scheduledTime && (
//           <p>Post scheduled for: {scheduledTime.toLocaleString()}</p>
//         )}
//         <button onClick={postToFacebookPage}>Publish to Facebook Page</button>
//       </div>
//     </div>
//   );
// }

// export default User;

import React, { useState } from "react";
import axios from "axios";

const User = ({ id, access_token }) => {
  const [message, setMessage] = useState("");
  const [pictureLinks, setPictureLinks] = useState([]);

  const uploadPhotos = async () => {
    const uploadedPhotoIds = [];

    for (const link of pictureLinks) {
      try {
        const response = await axios.post(
          `https://graph.facebook.com/${id}/photos`,
          {
            message: message,
            url: link,
            published: false,
          },
          {
            params: {
              access_token: access_token,
            },
          }
        );
        uploadedPhotoIds.push({ media_fbid: response.data.id });
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }

    return uploadedPhotoIds;
  };

  const postToFacebookPage = async (isScheduled) => {
    if (!pictureLinks.length) {
      console.log("Please enter picture links.");
      return;
    }

    const uploadedPhotoIds = await uploadPhotos();

    if (uploadedPhotoIds.length === 0) {
      console.log("No photos uploaded.");
      return;
    }

    try {
      let publishTime = null;

      if (isScheduled) {
        publishTime = Math.floor(Date.now() / 1000) + 720; // 12 minutes from now
      }

      const response = await axios.post(
        `https://graph.facebook.com/${id}/feed`,
        {
          message: message,
          attached_media: uploadedPhotoIds,
          published: !isScheduled,
          scheduled_publish_time: publishTime,
        },
        {
          params: {
            access_token: access_token,
          },
        }
      );

      if (isScheduled) {
        console.log("Post scheduled successfully:", response.data);
      } else {
        console.log("Post published successfully:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="User">
      <div className="PostForm">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <br />
        <input
          type="text"
          value={pictureLinks}
          onChange={(e) => setPictureLinks(e.target.value.split(","))}
          placeholder="Enter picture links separated by commas"
        />
        <br />
        <button onClick={() => postToFacebookPage(false)}>Publish</button>
        <button onClick={() => postToFacebookPage(true)}>Schedule</button>
      </div>
    </div>
  );
};

export default User;
