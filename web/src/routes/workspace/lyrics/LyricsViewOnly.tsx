import React, { useState } from 'react'
// GraphQL
import { useQuery } from "@apollo/client";
import { GET_LYRICS } from "../../../graphql/queries";
// Redux
import { connect , ConnectedProps } from "react-redux";

interface ComponentProps {
  project: {
    currentProject: string
  }
}

const mapState = (state : ComponentProps) => ({
  currentProject: state.project.currentProject
})

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

const LyricsViewOnly = ({ currentProject}: Props)  => {
  const { data, loading } = useQuery(GET_LYRICS , {
    variables: {
      projectId: currentProject
    }
  });

  return (
    <div className="lyrics-container">
    <div className="lyric-tab-header">
      <h5>Lyrics</h5>
    </div>
    <div className="lyric-tab-scroll-container">
      { !loading && data && data.lyrics && data.lyrics.length !== 0 ? data.lyrics.map((lyric:any)=> 
        <div className="lyric-tab-container" key={lyric.id}> 
          <div className="lyric-tab-top">
            <p>{lyric.option}</p>
          </div>
          <div className="lyric-content">
            <p>{lyric.lyric}</p>
          </div>
       </div>
      )
       : <li className="default-workspace">
       <p>There are no lyrics.</p>
      </li>
    }
      </div>
  </div>
  )
}

export default connector(LyricsViewOnly);
