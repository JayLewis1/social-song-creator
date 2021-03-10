import React, { Fragment, useEffect } from 'react'
import { Link } from "react-router-dom"
// GraphQL
import { useQuery, useMutation } from "@apollo/client";
import { CURRENT_PROJECT, MY_PROJECTS, MY_ACCOUNT, MY_POSTS, FEED_POSTS } from "../../../graphql/queries";
import { DELETE_PROJECT, REMOVE_CONTRIBUTOR } from "../../../graphql/mutations";
// Redux
import { connect, ConnectedProps } from "react-redux";
interface ComponentProps {
  project : {
    deleteProject: boolean
    options: string
    result:  {
      toggle: boolean
      type: string
      selectedId: string
    }
  }
}
const mapState = (state: ComponentProps) => ({
  deleteProject: state.project.deleteProject,
  result: state.project.result
})
type resultData =  {
  toggle: boolean
  type: string
  selectedId: string
}

const mapDispatch = {
  setDeleteProjectPanel: (payload: boolean) => ({ type: "SHOW_PROJECT_DELETE_PANEL", payload: payload }),
  toggleOptions: (projectId: string) => ({type: "PROJECT_OPTIONS", payload: projectId}),
  toggleProjectResult: (payload: resultData) => ({type: "PROJECT_RESULT", payload}) 
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux 

const ResultComponent = ({ result, toggleProjectResult, toggleOptions} : Props) => {
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const { data, loading} = useQuery(CURRENT_PROJECT, {
    variables: {
      projectId: result.selectedId
    }
  })
  const { data: meData } = useQuery(MY_ACCOUNT);
  const [removeContribtutor] = useMutation(REMOVE_CONTRIBUTOR);
  useEffect(() => {
    return () => {
      const result = {
        toggle: false,
        type: "",
        selectedId: ""
      }
      toggleProjectResult(result)
    }
  }, [toggleProjectResult])
  const deletProjectById = async () => {
    const id = result.selectedId;
    deleteProject({
        variables: { id }, 
        update: cache => {
           // Assign varaibel with data from MY_PROJECTS query
          const cacheMyData: any = cache.readQuery({ query: MY_PROJECTS });
          // Check to see if there is a cache
          if(cacheMyData !== null) {
          // Removing the selected project by filtering it out of array
          const updatedMyCache = cacheMyData.myProjects.filter(({id : deleteId}: any) => deleteId !== id);
          cache.writeQuery({ 
            query: MY_PROJECTS, 
            data: {
              myProjects: updatedMyCache
            }
          });
        } 
        for(let x = 0; x < cacheMyData.myProjects.length; x++) {
          if(cacheMyData.myProjects[x].id === id) {
            if(cacheMyData.myProjects[x].postId !== "" ) {
              const myPostsCache: any = cache.readQuery({ query: MY_POSTS });
              const feedCache: any = cache.readQuery({ query: FEED_POSTS });
              if(myPostsCache !== null) {
                let updatedPostCache = myPostsCache.myPosts.filter(({postId : deleteId}: any) => deleteId !== cacheMyData.myProjects[x].postId)
                cache.writeQuery({ 
                  query: MY_POSTS, 
                  data: {
                    myPosts: updatedPostCache
                }})
              }
              if(feedCache !== null) {
                let updatedFeedCache = feedCache.myFeed.filter(({postId : deleteId}: any) => deleteId !== cacheMyData.myProjects[x].postId);
                cache.writeQuery({ 
                  query: FEED_POSTS, 
                  data: {
                    myFeed: updatedFeedCache
                }})
              }
            }
          }
        }
      }
      }).then(() => {
        // setSelectedProject("")
        const resultData = {
          toggle: false,
          type: "",
          selectedId: ""
        }
        toggleProjectResult(resultData);
      })
      .catch(err => console.log(err) )
    }

    const removeAsContributor = async () => {
      const projectId = result.selectedId;

      await removeContribtutor({ 
        variables : {
          userId: meData.me.id,
          projectId
      }, update : (cache) => {
            // Get project cache
            const projectCache: any = cache.readQuery({ query: MY_PROJECTS })
            // Iterate cache and assign to new variable
            let cacheArray = [...projectCache.myProjects]
            // Loop through array
            for(let x = 0; x < cacheArray.length; x++) {
              // Find the project id in the array
              if(cacheArray[x].id === projectId ) {
                // Get index of project and splice out of array
                let index = cacheArray.indexOf(cacheArray[x]);
                cacheArray.splice(index, 1);
              }
            }
            /// Update myProjects cache
            cache.writeQuery({
              query: MY_PROJECTS,
              data: {
                myProjects : cacheArray
              }
            })
      } })
      try {      
        // setSelectedProject("")
        const resultData = {
          toggle: false,
          type: "",
          selectedId: ""
        }
        toggleProjectResult(resultData);
      } catch(err) {
        console.log(err);
      }

    }
  const closeComponent = () => {
    const resultData = {
      toggle: false,
      type: "",
      selectedId: ""
    }
    if(result.type === "delete"){
      toggleOptions(result.selectedId)
      toggleProjectResult(resultData); 
    } else {
      // setSelectedProject("")
      toggleProjectResult(resultData);
    }  
  }

  return (
    <div className="result-component">
      <div className="wrapper">
        { result.type === "share" && 
          <Fragment>
            <p>You shared <em>{ !loading && data && data.currentProject ? data.currentProject.name : "a project" }</em>. Would you like to see it on your feed?</p> 
            <span className="btn-wrapper">
              <Link to="feed">
                <span className="btn-bg"></span>
                <p>Go to feed</p>
              </Link>
              <button onClick={() => closeComponent()}>
                <p>Back to projects</p>
              </button>
            </span>
          </Fragment>
        }
          { result.type === "delete" && 
          <Fragment>
            <p>Are you sure you want to delete <em>{ !loading && data && data.currentProject ? data.currentProject.name : "a project" }</em>?</p> 
            <span className="btn-wrapper">
              <button onClick={() => deletProjectById()} className="delete-btn">
                <span className="btn-bg"></span>
                <p>Delete</p>
              </button>
              <button onClick={() => closeComponent()}>
                <p>Cancel</p>
              </button>
            </span>
          </Fragment>
        }
        { result.type === "remove" && 
          <Fragment>
            <p>Are you sure you want to remove yourself as a contributor on <em>{ !loading && data && data.currentProject ? data.currentProject.name : "a project" }</em>?</p> 
            <span className="btn-wrapper">
              <button onClick={() => removeAsContributor()} className="delete-btn">
                <span className="btn-bg"></span>
                <p>Remove</p>
              </button>
              <button onClick={() => closeComponent()}>
                <p>Cancel</p>
              </button>
            </span>
          </Fragment>
        }
      </div>
    </div>
  )
}
export default connector(ResultComponent)