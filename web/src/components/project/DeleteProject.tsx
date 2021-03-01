import React from 'react'

// GraphQL
import { useMutation } from "@apollo/client";
import { MY_PROJECTS } from "../../graphql/queries";
import { DELETE_PROJECT } from "../../graphql/mutations";

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

  return (
    <div className="delete-popup">
      <p>Are you sure you want to delete this project?</p>
      <span className="delete-buttons-wrappers">
        <button className="delete-btn" onClick={() => deletProjectById()}>Delete</button>
        <button onClick={() => setDeleteProjectPanel(false)}>Cancel</button>
    </span>
  </div>
  )
}

export default connector(DeleteProject);