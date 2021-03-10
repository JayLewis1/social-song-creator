import React, { Fragment } from 'react'
// GraphQL
import { useMutation } from "@apollo/client";
import { MY_PROJECTS, MY_POSTS, FEED_POSTS } from "../../../graphql/queries";
import { SHARE_PROJECT } from "../../../graphql/mutations"
// Redux
import { connect, ConnectedProps } from "react-redux";
interface ComponentProps {
  project : {
    deleteProject: boolean
    deleteId: string
    options: string
  }
}

const mapState = (state: ComponentProps) => ({
  options: state.project.options,

})
type resultData =  {
  toggle: boolean
  type: string
  selectedId: string
}
const mapDispatch = {
  toggleOptions: (projectId: string) => ({type: "PROJECT_OPTIONS", payload: projectId}), 
  setSelectedProject: (id: string) => ({ type: "SELECTED_PROJECT_ID", payload: id}),
  toggleProjectResult: (payload: resultData) => ({type: "PROJECT_RESULT", payload}) 
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux &  {
  projectId: string
  location : string
};

const Share = ({projectId, location, options, toggleOptions, toggleProjectResult, setSelectedProject } : Props) => {
  const [shareProject] = useMutation(SHARE_PROJECT);
  const shareProjectFunction = async () => {
   const response = await shareProject({
      variables: {
        projectId
      },
      update: (cache, { data: { shareProject } }) => {
        console.log(shareProject)
        // Read the MY_PROJECTS query cache
       const projectCache: any = cache.readQuery({query: MY_PROJECTS})
       if(projectCache !== null) {
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
        console.log(response)
        if(response.data.shareProject.success) {
          // setSelectedProject(options)
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
  return ( 
      <Fragment>
       { location === "options" &&  
       <button className="share-btn" onClick={() => shareProjectFunction()}>
       Share
       </button> }
       { location === "project" &&
        <button className="post-buttons responsive-share" onClick={() => shareProjectFunction()}>
            <img src="/assets/icons/post/share.svg" alt="Share post"/>
         </button>
        }
      </Fragment>
   )
}

export default connector(Share);