import React from 'react'
import { withRouter } from "react-router-dom";
// Redux
import { connect, ConnectedProps } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import { MY_ACCOUNT, MY_PROJECTS, MY_POSTS, FEED_POSTS, CURRENT_PROJECT } from "../../../graphql/queries";
import { SHARE_PROJECT } from "../../../graphql/mutations"
interface ComponentProps {
  application : { 
    contributorsPanel: boolean
  }
  project : {
    deleteProject: boolean
    deleteId: string
    options: string
  }
}

const mapState = (state: ComponentProps) => ({
  deleteProject: state.project.deleteProject,
  deleteId : state.project.deleteId,
  options: state.project.options,
  contributorsPanel: state.application.contributorsPanel
})
type resultData =  {
  toggle: boolean
  type: string
  selectedId: string
}

const mapDispatch = {
  activatePlaybar : (payload: boolean) => ({ type: "OPEN_PLAYBAR", payload: payload }),
  assignTrack : (payload: object) => ({type: "ASSIGN_TRACK", payload: payload}),
  setSelectedProject: (id: string) => ({ type: "SELECTED_PROJECT_ID", payload: id}),
  toggleContributors : (payload: boolean) => ({type: "TOGGLE__CONTRIBUTORS", payload: payload}),
  toggleOptions: (projectId: string) => ({type: "PROJECT_OPTIONS", payload: projectId}),
  toggleProjectResult: (payload: resultData) => ({type: "PROJECT_RESULT", payload}) 
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux &  {
  history: any
};
const Options = ({ contributorsPanel, options, history, toggleOptions, toggleProjectResult, setSelectedProject, toggleContributors} : Props) => {
  const [shareProject] = useMutation(SHARE_PROJECT);
  const { data, loading } = useQuery(CURRENT_PROJECT, {
    variables: {
      projectId: options
    }
  });
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT)


  const shareProjectFunction = async () => {
    await shareProject({
      variables: {
        projectId: options
      },
      update: (cache, { data: { shareProject } }) => {
        console.log(shareProject)
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
        toggleOptions("")
        history.push("/feed");
    } catch(err) {
      console.log(err);
    }
  }
  const setDeleteProject = () => {
    setSelectedProject(options)
    const resultData = {
      toggle: true,
      type: "delete",
      selectedId: options
    }
    toggleProjectResult(resultData);
    toggleOptions("");
  }

  const removeAsContributor = () => {
    const resultData = {
      toggle: true,
      type: "remove",
      selectedId: options
    }
    toggleProjectResult(resultData);
    toggleOptions("");
  }


  const addContributorFunc = () => {
    toggleContributors(true)
    setSelectedProject(options)
    toggleOptions("");
  }
  return (
    <div className="options-container">
        <div className="options">
          { !loading && data && data.currentProject && data.currentProject.postId === null && 
           <button className="share-btn" onClick={() => shareProjectFunction()}>Share</button>
          }
          <button className="add-btn" onClick={() => addContributorFunc()}>Edit Contributors</button>
          { !meLoading && !loading && meData.me.id === data.currentProject.creatorId ?
           <button className="delete-btn" onClick={() => setDeleteProject()}>Delete</button>
           :
           <button className="delete-btn" onClick={() => removeAsContributor()}>Remove as contributor</button>
           }
         
          <button onClick={() => toggleOptions("")}>Cancel</button>
        </div>
    </div>
  )
}

export default withRouter(connector(Options));