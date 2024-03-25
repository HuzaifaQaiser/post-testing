import React, { Component } from "react";
import axios from "axios";

class Caption extends Component {
  state = {
    photoFile: null,
    caption: "",
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleFileChange = (event) => {
    this.setState({
      photoFile: event.target.files[0],
    });
  };

  postPhotoToFacebook = () => {
    const { photoFile, caption } = this.state;
    const { accessToken, pageId } = this.props; // Access accessToken and pageId from props

    let formData = new FormData();
    formData.append("file", photoFile);
    formData.append("caption", caption);

    axios
      .post(
        `https://graph.facebook.com/${pageId}/photos?access_token=${accessToken}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { caption } = this.state;
    return (
      <div className="Caption">
        <input type="file" accept="image/*" onChange={this.handleFileChange} />
        <br />
        <input
          type="text"
          name="caption"
          value={caption}
          onChange={this.handleInputChange}
          placeholder="Enter caption"
        />
        <br />
        <button onClick={this.postPhotoToFacebook}>
          Post Photo to Facebook
        </button>
      </div>
    );
  }
}

export default Caption;
