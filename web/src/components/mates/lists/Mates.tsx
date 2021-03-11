import React, { Fragment } from "react";
import { Link } from "react-router-dom"
// GrahphQL
import { useQuery } from "@apollo/client";
import { GET_MY_MATES } from "../../../graphql/queries"
import Mate from "../mate/Mate";
interface ComponentProps {
  userId: string
}
const Mates = ({userId}: ComponentProps) => {
  const { data, loading } = useQuery(GET_MY_MATES, {
  variables : {
    userId
  } 
  });

  return (
    <Fragment>
        { !loading && data && data.getMates.length !== 0 ? data.getMates.map((mate: any) => 
        <Fragment key={mate.id}> 
          <Mate mate={mate} />
        </Fragment>
        ) : 
        <li className="no-posts" key={0}>
          <p>You have no mates. Check out the <Link to="/discover">Discover</Link> page and find some new mates.</p>
        </li> }
    </Fragment>
  )
}

export default Mates;