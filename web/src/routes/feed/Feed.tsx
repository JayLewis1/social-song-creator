import React from 'react'

import FeedPosts from "../../components/post/FeedPosts";
import CreateComponent from "../../components/create/CreateComponent"

interface ComponentProps {
}

const Feed = () => {
    return (
      <div className="component-container">
        <div className="feed-flex">
         <CreateComponent />
          <FeedPosts />
        </div>
      </div> 
    );
}

export default Feed;