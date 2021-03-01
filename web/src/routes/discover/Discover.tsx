import React from 'react'

import DiscoverPost from "../../components/post/DiscoverPost";
import CreateComponent from "../../components/create/CreateComponent"
interface ComponentProps {
}

const Discover = () => {
    return (
      <div className="component-container">
        <div className="feed-flex">
          <CreateComponent />
          <DiscoverPost />
        </div>
      </div> 
    );
}

export default Discover;