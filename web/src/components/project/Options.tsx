import React from 'react'

const Options:React.FC = () => {
  return (
    <div className="options-container">
        <div className="options">
          <button className="share-btn">Share</button>
          <button className="add-btn">Add Contributor</button>
          <button className="delete-btn">Delete</button>
          <button>Cancel</button>
        </div>
    </div>
  )
}

export default Options;