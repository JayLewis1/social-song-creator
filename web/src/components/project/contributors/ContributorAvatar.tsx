import React, { Fragment, useState} from 'react'
import { Link } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { GET_CONTRIBUTORS } from "../../../graphql/queries";
interface ComponentProps {
  projectId: string
}

const ContributorAvatar = ({projectId}:ComponentProps) => {
  const [userName, setUserName] = useState("");
  const { data, loading } = useQuery(GET_CONTRIBUTORS, { variables: { projectId }})
  return (
    <Fragment>
    { !loading && data && data.contributors.length !== 0 ? data.contributors.map((user: any) => 
     <Link key={user.id} to={`/profile/${user.id}`} className="contributor-avatar-link" 
     onMouseOver={() => setUserName(user.firstName)}
     onMouseOut={() => setUserName("")}>
      <img src={user.avatar} alt="User's Avatar"/>
      { userName === user.firstName && 
       <div className="avatar-hover">
         <p>{user.firstName}</p>
      </div>}
    </Link>
   ): null }
   </Fragment>
  )
}

export default ContributorAvatar;