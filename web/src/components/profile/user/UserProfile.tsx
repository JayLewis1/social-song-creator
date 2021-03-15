import React, { useState, Fragment } from 'react'
import { withRouter, useLocation } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { USER_BY_ID } from "../../../graphql/queries";
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components 
import Information from "./components/Information"
import Options from "../../../components/mates/options/Options";
import Validation from "../../../components/mates/functions/Validation";
import Posts from "./posts/Posts";
import Projects from "./projects/Projects";
import Mates from "../../mates/lists/Mates";


interface ComponentProps {  
    mates: {
        options : boolean
        remove: boolean
        add : boolean
      }
  }
  
  const mapState = (state: ComponentProps) => ({
    options: state.mates.options,
    remove: state.mates.remove,
    add : state.mates.add
  })
  
  const mapDispatch = {

  }
  
  const connector = connect(mapState,mapDispatch);
  
  type PropsFromRedux = ConnectedProps<typeof connector>;
  type Props = PropsFromRedux & {
      history : any
  }
  
const ProfileByID = ({ add, options, remove } : Props) => {
    const location: any = useLocation();
    const params = location.pathname.split("/")
    const userId = parseInt(params[2]);
    const { data, loading } = useQuery(USER_BY_ID, {
        variables: {
            userId: userId,
        } 
    });
    const [display , setDisplayOption] = useState("posts");

    if(loading) {
        return <div>loading...</div>
    }
    const onChange = (e:React.ChangeEvent<HTMLSelectElement> ) => {
        setDisplayOption(e.target.value);
    }

    return (
    <div className="component-container">
        <div className="user-profile-wrapper"> 
        {/* <div className="component-header">
        <h3 className="feed-title">{data.user.firstName + " " + data.user.lastName}</h3>
        { !meLoading && meData && meData.me.id === userId  ? null : myFriend === true ?
            <button 
                onClick={() => removeMateFunc(data.user.id)} className="remove-mate"
                disabled={addBtnDisabled === true}>
                <p>Remove mate</p>
            </button> :
             <button 
            onClick={() => addMate(data.user.id)} className="add-mate"
            disabled={addBtnDisabled === true}>
                <p>Add Mate</p>
                <img src="/assets/icons/profile/add.svg" alt="Add Mate"/>
        </button>}

        {clearMessage === false && addBtnDisabled === true &&
            <span className="res-status" style={ {backgroundColor: "#f8323b"} }>
                <div></div> 
                <p>{responseStatus}</p>
            </span>
        }
       { clearMessage === false && notificationSent === true &&
          <span className="res-status" style={ {backgroundColor: "2767fa", width: "200px"}}>
          <div></div> 
          <p>{responseStatus}</p>
      </span> }
        </div> */}
         {!loading && data && data.user &&
         <Fragment>
            <Information user={data.user}/>
            <ul className="profile-components-options">
                <li>
                    <button 
                    onClick={() => setDisplayOption("posts")} 
                    className={ display === "posts" ? "display-active" : "display-normal"}>Posts</button>
                </li>
                <li>
                    <button 
                    onClick={() => setDisplayOption("projects")}
                    className={ display === "projects" ? "display-active" : "display-normal"}>Projects</button>
                </li>
                <li>
                    <button  
                        className={ display === "mates" ? "display-active" : "display-normal"}
                        onClick={() => setDisplayOption("mates")}>Mates</button>
                </li>
                <select value={display} onChange={(e) => onChange(e)}>
                    <option value="posts">Posts</option>
                    <option value="projects">Projects</option>
                    <option value="mates">Mates</option>
                </select>
            </ul> 
            <ul className="profile-display">
            { display === "posts" && <Posts />}
            { display === "projects" && <Projects />}
            { display === "mates" && <Mates userId={data.user.id} />}
            </ul>
        </Fragment>
        }
        {/* { options === true && <Options type="profile" mateId={userId}/>}
        {remove === true  && <Validation type="remove" mateId={userId} />}
        {add === true &&  <Validation type="add" mateId={userId} />} */}
        </div>
        </div>
    );
}

export default withRouter(connector(ProfileByID));