import React, { useState } from "react";
import { Link } from "react-router-dom"
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components 
import Options from "../options/Options";
import Remove from "../functions/Remove";

interface ComponentProps {
  mates: {
    options : boolean
    remove: boolean
  }
}
const mapState = (state: ComponentProps) => ({
  options: state.mates.options,
  remove: state.mates.remove
})

const mapDispatch = {
  toggleMatesOptions: (payload: boolean) => ({type: "MATES_OPTIONS", payload})
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
const Mate = ({mate, options, remove, toggleMatesOptions}: Props) => {
  const [selectedId, setSelectedId] = useState(-1)

  const toggleOptionsMenu = (id: number) => {
    if(options === true) {
      setSelectedId(0);
      toggleMatesOptions(false);
    } else {
      setSelectedId(id);
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
          { options === true && selectedId === mate.id &&  <Options mateId={mate.id}/>}
          {remove === true && selectedId === mate.id  && <Remove mateId={mate.id} />}
        </li> 
  )
}

export default connector(Mate);