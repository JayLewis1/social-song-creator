import React, { useState, useEffect } from "react";
import  Routes  from "./Routes";
import { setAccessToken } from "./accessToken"

interface Props {}

export const App: React.FC<Props> = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sending refresh token to get new accessToken
    fetch('https://foliotune.herokuapp.com/refresh_token', {
      method: "POST",
      credentials: "include"
    }).then(async x => {
      // Get accessToken from response data
      const { accessToken } = await x.json();
      // Setting new accessToken
      setAccessToken(accessToken);
      setLoading(false);
   })
  },[]);

  if(loading) {
    return <div>loading...</div>
  }

  return <Routes />;
}