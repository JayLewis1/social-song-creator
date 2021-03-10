import React from 'react'
// GraphQL
import { useQuery } from "@apollo/client";
import { GET_MY_MATES } from "../../graphql/queries";

const MatesSidebar = () => {
  const { data : mateData,loading: mateLoading } = useQuery(GET_MY_MATES);
  
  return (
    <div className="sidebar">
        <ul className="mates-list"> 
        { !mateLoading && mateData && mateData.getMates.length !== 0 &&  mateData.getMates.map((mate: any) => 
           <li className="mate-wrapper">
             <img src={mate.avatar} alt="Profile Avatar"/>
             <p>{mate.firstName + " " + mate.lastName}</p>
           </li>
        )}
        </ul>
    </div>
  )
}

export default MatesSidebar;