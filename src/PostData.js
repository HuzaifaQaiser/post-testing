import React from "react";
import User from "./User";

function PostData({ pages }) {
  return (
    <div>
      {pages.map((page) => (
        <User key={page.id} id={page.id} access_token={page.access_token} />
      ))}
    </div>
  );
}

export default PostData;
