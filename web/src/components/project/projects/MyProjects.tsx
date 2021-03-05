import React, { Fragment, useState, useEffect } from 'react'
import { Link, withRouter } from "react-router-dom";
// GraphQL
import { useQuery, useMutation } from "@apollo/client";
import { MY_PROJECTS, MY_POSTS, FEED_POSTS, MY_ACCOUNT } from "../../../graphql/queries";
import { SHARE_PROJECT } from "../../../graphql/mutations"
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components
// import DeleteProject from "../functions/DeleteProject";
import ContributorPanel from "../contributors/ContributorPanel"
import ContributorAvatar from "../contributors/ContributorAvatar";
import FormatTimestamp from "../../formatTime/FormatTimestamp";
import Options from "../components/Options";
import ResultComponent from "../components/ResultComponent";

interface ComponentProps {
  application : { 
    contributorsPanel: boolean
  }
  project : {
    deleteProject: boolean
    selectedProject: string
    options: string
    result: {
      toggle: boolean,
      type: string,
      currentId: string
    }
  }
}

const mapState = (state: ComponentProps) => ({
  deleteProject: state.project.deleteProject,
  selectedProject : state.project.selectedProject,
  options: state.project.options,
  contributorsPanel: state.application.contributorsPanel,
  result: state.project.result
})

type resultData =  {
  toggle: boolean
  type: string
  selectedId: string
}

const mapDispatch = {
  activatePlaybar : (payload: boolean) => ({ type: "OPEN_PLAYBAR", payload: payload }),
  assignTrack : (payload: object) => ({type: "ASSIGN_TRACK", payload: payload}),
  setDeleteProjectPanel: (payload: boolean) => ({ type: "SHOW_PROJECT_DELETE_PANEL", payload: payload }),
  setSelectedProject: (id: string) => ({ type: "SELECTED_PROJECT_ID", payload: id}),
  toggleContributors : (payload: boolean) => ({type: "TOGGLE__CONTRIBUTORS", payload: payload}),
  intialiseProject: (bool: boolean ) => ({type: "INIT_PROJECT", payload: bool }),
  toggleOptions: (projectId: string) => ({type: "PROJECT_OPTIONS", payload: projectId}),
  toggleProjectResult: (payload: resultData) => ({type: "PROJECT_RESULT", payload}) 
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux &  {
  history: any
};

const MyProjects = ({ selectedProject, deleteProject, history, contributorsPanel, options,result, setDeleteProjectPanel, setSelectedProject, activatePlaybar,toggleContributors, intialiseProject, assignTrack, toggleOptions , toggleProjectResult }:Props) => {
  const [idForContributor, setIdForContributor] = useState("");
  const [shareProject] = useMutation(SHARE_PROJECT);
  const { data, loading } = useQuery(MY_PROJECTS);
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);

  useEffect(() => {
    return () => {
      setSelectedProject("");
      setDeleteProjectPanel(false);
    }
  }, [setSelectedProject, setDeleteProjectPanel])
  if(loading) {
    return <div>Loading...</div>
  }

  const toggleDeletePopUp = (id: string) => {
    setSelectedProject(id);
    setDeleteProjectPanel(true);
  }

  const openPlaybarAndAssignTrackId = (trackId: string, projectId: string, projectName: string) => {
    activatePlaybar(true);
    const dataObject = {
      id: trackId,
      projectId,
      trackName: ""
    }
    assignTrack(dataObject)
  }
  const addContributorFunc = (projectId: string) => {
    if(idForContributor === projectId) {
      if(contributorsPanel === false) {
        toggleContributors(true)
        setIdForContributor(projectId)
      } else {
        toggleContributors(false)
        setIdForContributor("")
      } 
    } else {
      setIdForContributor(projectId)
      toggleContributors(true)
    }
  }

  const shareProjectFunction = async (projectId: string) => {
   const response = await shareProject({
      variables: {
        projectId
      },
      update: (cache, { data: { shareProject } }) => {
        // Read the MY_PROJECTS query cache
       const projectCache: any = cache.readQuery({query: MY_PROJECTS})
       // Assign and iterate the cache so we can modify the Array
       let modifyCache = [...projectCache.myProjects];
       let index: number;
       // Loop the project cache array
       for(let x = 0; x < modifyCache.length; x++) {
         // Find the post that matches our newly shared post with their ids
        if(shareProject.post.id === modifyCache[x]) {
          // Get the index of the matching project
          index = modifyCache.indexOf(modifyCache[x])
        }
       }
        // Remove the matching project by its index and then replace our new updated post
        modifyCache.splice(index!, 1, shareProject.post)
        cache.writeQuery({ 
          query : MY_PROJECTS,
          data:  {
           myProjects: modifyCache
         }
       })
       // Getting profile post cache
       const postCache: any = cache.readQuery({query: MY_POSTS})
       // Iterate cache and add the shareProject
       if(postCache !== null) {
       let modifyPostCache = [...postCache.myPosts, shareProject ];
       // Update cache
        cache.writeQuery({ 
          query : MY_POSTS,
          data:  {
           myPosts: modifyPostCache
         }
       })
      }
        // Getting feed post cache
       const feedCache: any = cache.readQuery({query: FEED_POSTS})
       if(feedCache !== null) {
        // Iterate cache and add the shareProject
       let modifyFeedCache = [...feedCache.myFeed, shareProject ];
        // Update cache
        cache.writeQuery({ 
          query : FEED_POSTS,
          data:  {
            myFeed: modifyFeedCache
         }
       })
      }

      }
    })
    try {
      console.log(response)
      if(response.data.shareProject.success) {
        setSelectedProject(projectId)

        const result = {
          toggle: true,
          type: "share",
          selectedId: projectId
        }
        toggleProjectResult(result)

      }

    } catch(err) {
      console.log(err);
    }
  }

  const toggleProjectPanel = () => {
    intialiseProject(true);
  }

  const toggleOptionsMenu = (id: string) => {
    if(options === "") {
      toggleOptions(id)
    } else {
      toggleOptions("")
    }
  }


    return (
     <Fragment>
      {!loading && data && data.myProjects.length !== 0  ?
      data.myProjects.map((project: any) => 
        <li className="project" key={project.id}>
            <span className="top">
              <span className="project-details">
                <span>
                <Link to={`/workspace/${project.id}`} className="project-name">{project.name}</Link>
                { !meLoading && meData && meData.me.id !== project.creatorId &&
                   <Link to={`/profile/${project.creatorId}`} className="project-creator"> by <em>{project.creatorName}</em></Link>
                }
                </span>
                <FormatTimestamp timestamp={project.created} />
              </span>
              <span className="responsive-btns">
                <button className="post-buttons responsive-play"  onClick={() => openPlaybarAndAssignTrackId(project.mainTrack, project.id, project.name)}>
                  <img src="/assets/icons/post/play-blue.svg" alt="Play"/>
                </button>
                { project.postId === null &&  
                  <button className="post-buttons responsive-share" onClick={() => shareProjectFunction(project.id)}>
                    <img src="/assets/icons/post/share.svg" alt="Share post"/>
                 </button>
                }
                <button className="post-buttons" onClick={() => toggleOptionsMenu(project.id)}>
                  <img src="/assets/icons/post/options.svg" alt="Project options"/>
                </button>
              </span>
            </span>
            <div className="bottom">
            {project.isPublic === true ? 
              <p className="public">Public</p> :
              <p className="private">Private</p>
            }
              <span className="contributors">
                {/* <button onClick={() => addContributorFunc(project.id)}>Contributors</button> */}
                <ContributorAvatar projectId={project.id} />
              </span>  
            </div>
        </li> 
       ) : 
       
       <div className="no-posts">
       <p>You have no projects yet.</p>
         <button onClick={() => toggleProjectPanel()}>  Why not create a new project? 
         </button>
     </div> }
     {contributorsPanel === true && <ContributorPanel />}
    { options !== "" && <Options/>}
    { result.toggle && <ResultComponent /> }
    </Fragment>
    );
} 

export default withRouter(connector(MyProjects));

