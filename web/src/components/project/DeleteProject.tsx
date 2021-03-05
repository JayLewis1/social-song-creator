import React, { Fragment } from 'react'
// GraphQL
import { useMutation, useQuery } from "@apollo/client";
import { MY_PROJECTS, MY_ACCOUNT, CURRENT_PROJECT } from "../../graphql/queries";
import { DELETE_PROJECT, REMOVE_CONTRIBUTOR } from "../../graphql/mutations";

import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {
  project: {
    deleteId: string
  }
}

const mapState = (state: ComponentProps) => ({
  deleteId : state.project.deleteId
})

const mapDispatch = {
  setDeleteProjectPanel: (payload: boolean) => ({ type: "SHOW_PROJECT_DELETE_PANEL", payload: payload }),
  setDeleteId: (id: string) => ({ type: "SET_ID_FOR_DELETE", payload: id})
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux;

const DeleteProject = ({deleteId, setDeleteProjectPanel, setDeleteId}:Props) => {
  const [deleteProject] = useMutation(DELETE_PROJECT);
  const [removeContribtutor] = useMutation(REMOVE_CONTRIBUTOR);
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);
  const { data, loading } = useQuery(CURRENT_PROJECT, {
    variables : {
      projectId: deleteId
    }
  });

  const deletProjectById = async () => {
    const id = deleteId; 
    deleteProject({
        variables: { id }, 
        update: cache => {
           // Assign varaibel with data from MY_PROJECTS query
          const cacheMyData: any = cache.readQuery({ query: MY_PROJECTS });
          // Check to see if there is a cache
          if(cacheMyData !== null) {
          // Removing the selected project by filtering it out of array
          console.log(id);
          const updatedMyCache = cacheMyData.myProjects.filter(({id : deleteId}: any) => deleteId !== id);
          console.log(updatedMyCache);
          cache.writeQuery({ 
            query: MY_PROJECTS, 
            data: {
              myProjects: updatedMyCache
            }
          });
          const newCache: any = cache.readQuery({ query:MY_PROJECTS }); 
            console.log(newCache);
        } 
      }
      }).then(() => {
        setDeleteId("");
        setDeleteProjectPanel(false);
      })
      .catch(err => console.log(err) )
    }
    
    const removeAsContributor = async () => {
      const projectId = deleteId;

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
        setDeleteId("");
        setDeleteProjectPanel(false);
      } catch(err) {
        console.log(err);
      }

    }

  return (
    <div className="delete-popup">
      {
        !meLoading && !loading && meData && meData.me.id === data.currentProject.id ? 
        <Fragment>
          <p>Are you sure you want to delete this project?</p>
          <span className="delete-buttons-wrappers">
            <button className="delete-btn" onClick={() => deletProjectById()}>Delete</button>
            <button onClick={() => setDeleteProjectPanel(false)}>Cancel</button>
        </span>
      </Fragment> :
       <Fragment>
       <p>Are you sure you want to remove yourself from this project?</p>
       <span className="delete-buttons-wrappers">
         <button className="delete-btn" onClick={() => removeAsContributor()}>Remove</button>
         <button onClick={() => setDeleteProjectPanel(false)}>Cancel</button>
     </span>
   </Fragment> 
      } 

  </div>
  )
}

export default connector(DeleteProject);