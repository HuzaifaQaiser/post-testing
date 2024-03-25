import React, { Component } from "react";
import axios from "axios";

class User extends Component {
  state = {
    pages: [],
    selectedPage: null,
    photoFile: null,
    caption: "",
  };

  componentDidUpdate(prevProps) {
    if (prevProps.userID !== this.props.userID) {
      this.fetchUserPages();
    }
  }

  fetchUserPages = async () => {
    const { userID, accessToken } = this.props;

    try {
      const response = await axios.get(
        `https://graph.facebook.com/${userID}/accounts?fields=name,id,category,access_token,tasks&access_token=${accessToken}`
      );
      console.log(response.data);
      this.setState({ pages: response.data.data });
    } catch (error) {
      console.error(error);
    }
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
    const { photoFile, caption, selectedPage } = this.state;
    const { access_token, id } = selectedPage;

    let formData = new FormData();
    formData.append("file", photoFile);
    formData.append("caption", caption);

    axios
      .post(
        `https://graph.facebook.com/${id}/photos?access_token=${access_token}`,
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
    const { pages, selectedPage, photoFile, caption } = this.state;
    return (
      <div className="User">
        {pages.map((page) => (
          <div key={page.id}>
            <h2>{page.name}</h2>
            <p>{page.category}</p>
            <p>Page ID: {page.id}</p>
            <p>Access Token: {page.access_token}</p>
            <p>Tasks: {page.tasks.join(", ")}</p>
            {/* Set selectedPage when a page is clicked */}
            <button onClick={() => this.setState({ selectedPage: page })}>
              POST DATA
            </button>
          </div>
        ))}
        {selectedPage && (
          <div className="Caption">
            <input
              type="file"
              accept="image/*"
              onChange={this.handleFileChange}
            />
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
        )}
      </div>
    );
  }
}

export default User;
