import React, { Fragment } from 'react'
import { useQuery } from "@apollo/client";
import { USER_BY_ID } from "../../../graphql/queries";
// Redux
import { connect, ConnectedProps } from "react-redux";
const mapDispatch = {
  intialiseProject: (bool: boolean ) => ({type: "INIT_PROJECT", payload: bool }),
}

const connector = connect(null, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  type: string
  userId: number
};

 const EmptyState = ({type , userId, intialiseProject}: Props) => {
   const { data, loading } = useQuery(USER_BY_ID, {
     variables: {
       userId
     }
   })
  return (
    <div className="no-posts">
      { type === "user" ?  
          <p> <em>{!loading && data && data.user && data.user.firstName}</em> has no projects</p>  :
        <Fragment>
          <p>You have no projects yet.</p>
          <button onClick={() => intialiseProject(true)}>  Why not create a new project? 
          </button>
        </Fragment>
      }

 </div>
  )
}
export default connector(EmptyState);