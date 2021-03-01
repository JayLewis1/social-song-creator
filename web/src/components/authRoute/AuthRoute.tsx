import React , {Fragment , useEffect, useState} from 'react'
import { withRouter, useLocation } from "react-router-dom";
// GraphQL
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT_USER } from "../../graphql/mutations"
import { MY_ACCOUNT } from "../../graphql/queries"

interface ComponentProps {
  history: any
}
const AuthRoute = ({ history }:ComponentProps) => {
  const [locationAllowed , setLocation] = useState("")
  const { data, loading } = useQuery(MY_ACCOUNT);
 
  var location = useLocation();
  var pathName = location.pathname

  useEffect(() => {
    if(!loading && data && !data.me) {
      if(pathName !== "/login" && pathName !== "/register") {
       history.push("/login")
      }
    }
  }, [loading, data, pathName, history])


    return null;
}

export default withRouter(AuthRoute);