import React, { Fragment, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
// GraphQL
import { useQuery, useMutation } from "@apollo/client";
import { MY_PROJECTS, SEARCH_PROJECTS } from "../../graphql/queries";
import { SHARE_PROJECT } from "../../graphql/mutations"
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components
import DeleteProject from "./DeleteProject";
import AddContributor from "./AddContributor"
import ContributorAvatar from "./ContributorAvatar";
import FormatTimestamp from "../formatTime/FormatTimestamp";

interface ComponentProps {
  application : { 
    contributorsPanel: boolean
  }
  project : {
    deleteProject: boolean
    deleteId: string
  }
}

const mapState = (state: ComponentProps) => ({
  deleteProject: state.project.deleteProject,
  deleteId : state.project.deleteId,
  contributorsPanel: state.application.contributorsPanel
})

const mapDispatch = {
  activatePlaybar : (payload: boolean) => ({ type: "OPEN_PLAYBAR", payload: payload }),
  setDeleteProjectPanel: (payload: boolean) => ({ type: "SHOW_PROJECT_DELETE_PANEL", payload: payload }),
  setDeleteId: (id: string) => ({ type: "SET_ID_FOR_DELETE", payload: id}),
  toggleContributors : (payload: boolean) => ({type: "TOGGLE__CONTRIBUTORS", payload: payload}),
  intialiseProject: (bool: boolean ) => ({type: "INIT_PROJECT", payload: bool }),
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux;

const MyProjects = ({ deleteId, deleteProject, setDeleteProjectPanel, setDeleteId, activatePlaybar, contributorsPanel,toggleContributors, intialiseProject }:Props) => {
  const [idForContributor, setIdForContributor] = useState("");
  const [selectedProject, setProjectId] = useState("");
  const [sharedResponse, setSharedResponse] = useState({
    response : false,
    success : false,
    data: "",
    projectId: ""
  });
  const [shareProject] = useMutation(SHARE_PROJECT);
  const { data, loading } = useQuery(MY_PROJECTS);
  const { data: searchData, loading: searchLoading } = useQuery(SEARCH_PROJECTS);

  useEffect(() => {
    return () => {
      setDeleteId("");
      setDeleteProjectPanel(false);
    }
  }, [])
  if(loading) {
    return <div>Loading...</div>
  }

  const toggleDeletePopUp = (id: string) => {
    setDeleteId(id);
    setDeleteProjectPanel(true);
  }

  const openPlaybarAndAssignTrackId = () => {
    activatePlaybar(true);
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
    setProjectId(projectId)
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
      }
    })
    try {
      
        setSharedResponse({
          response : true,
          success : response.data.shareProject.success,
          data: response.data.shareProject.response,
          projectId
        })
        const timer = setTimeout(() => {
            setSharedResponse({...sharedResponse, response: false})
            setProjectId("")
        }, 5000);
        return () => clearTimeout(timer);

    } catch(err) {
      console.log(err);
    }
  }
  
  const toggleProjectPanel = () => {
    intialiseProject(true);
  }
    return (
     <Fragment>
      {!loading && data && data.myProjects.length !== 0  ?
      data.myProjects.map((project: any) => 
        <li className="project" key={project.id}>
          {/* <Link to={`/workspace/${project.id}`}> </Link> */}
            <span className="top">
              <span className="project-details">
                <Link to={`/workspace/${project.id}`} className="project-name">{project.name}</Link>
                {/* <p className="project-date">8 January 2020</p> */} 
                <FormatTimestamp timestamp={project.created} />
              </span>
              <span className="btn-wrapper">
                <button className="post-buttons" onClick={() => openPlaybarAndAssignTrackId()}>
                  <img src="/assets/icons/post/play-dark.svg" alt="Play post"/>
                </button>
                { project.postId === null &&  <button className="post-buttons" onClick={() => shareProjectFunction(project.id)}>
                  <img src="/assets/icons/post/share.svg" alt="Share post"/>
                </button>}
                <button className="post-buttons" onClick={() => toggleDeletePopUp(project.id)}>
                  <img src="/assets/icons/workspace/delete.svg" alt="Delete post"/>
                </button> 
              </span>
            </span>
            {/* <div className="contributors">
            <button onClick={() => addContributorFunc(project.id)}>Contributors</button>
                <ContributorAvatar projectId={project.id} />
            </div> */}
            <div className="bottom">
            {project.isPublic === true ? 
              <p className="public">Public</p> :
              <p className="private">Private</p>
 
            }
              <span className="contributors">
                <button onClick={() => addContributorFunc(project.id)}>Contributors</button>
                <ContributorAvatar projectId={project.id} />
              </span>  
            </div>
            {contributorsPanel === true && idForContributor === project.id && <AddContributor currentProject={project.id} />}
          { deleteProject === true && deleteId === project.id ? <DeleteProject />  : null}
          {sharedResponse.response === true && sharedResponse.projectId === project.id && 
            <div className={sharedResponse.success === true ? "shared-response success-true" : "shared-response success-false"} >
              <p>{sharedResponse.data}</p>
            </div>
          }
        </li> 
       ) : 
       
       <div className="no-posts">
       <p>You have no projects yet.</p>
         <button onClick={() => toggleProjectPanel()}>  Why not create a new project? 
         </button>
     </div> }
    </Fragment>
    );
} 

export default connector(MyProjects);