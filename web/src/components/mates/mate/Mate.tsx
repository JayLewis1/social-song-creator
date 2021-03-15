import React, { useState } from "react";
import { Link } from "react-router-dom"
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components 
import Options from "../options/Options";
import Validation from "../functions/Validation";

interface ComponentProps {
  mates: {
    options : boolean
    remove: boolean
    add : boolean
    id : number
  }
}
const mapState = (state: ComponentProps) => ({
  userId: state.mates.id,
  options: state.mates.options,
  remove: state.mates.remove,
  add : state.mates.add
  
})

const mapDispatch = {
  toggleMatesOptions: (payload: boolean) => ({type: "MATES_OPTIONS", payload}),
  selectedUserId: (userId: number ) => ({type: "MATES_SELECTED_ID", payload: userId})
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  mate: {
    id: number
    avatar: string
    firstName: string
    lastName: string
  }
}
const Mate = ({userId, mate, options, remove, add, toggleMatesOptions, selectedUserId}: Props) => {
  const [selectedId, setSelectedId] = useState(-1)

  const toggleOptionsMenu = (id: number) => {
    console.log(id);
    if(options === true) {
      setSelectedId(0);
      selectedUserId(0);
      toggleMatesOptions(false);
    } else {
      setSelectedId(id);
      selectedUserId(id)
      toggleMatesOptions(true);
    }
  }
  
  return (
        <li key={mate.id} className="mate-container">
          <img src={mate.avatar} alt="User Avatar"></img>
          <span>
            <p>{mate.firstName} {mate.lastName}</p>
            <Link to={`/profile/${mate.id}`}>View Profile</Link>
          </span>
          <span className="post-btn-wrapper"> 
            <button className="post-buttons" onClick={() => toggleOptionsMenu(mate.id)}>
              <img src="/assets/icons/post/options.svg" alt="Project options"/>
            </button>
          </span> 
          {selectedId === mate.id &&  <p>{mate.id}</p>}
          { options === true && userId === mate.id &&  <Options type="user" />} 
          {remove === true && userId === mate.id  && <Validation type="remove" />}
          {add === true &&  userId=== mate.id  && <Validation type="add" />} 
        </li> 
  )
}

export default connector(Mate);