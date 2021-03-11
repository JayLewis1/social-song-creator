import React, { useState, useEffect } from 'react'
import { withRouter, useLocation } from "react-router-dom";
// GraphQL
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "../../../graphql/mutations";
import {  MY_PROJECTS } from "../../../graphql/queries";
// Redux
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {
  project: {
    initialised: boolean,
    projectDetails: {}
  }  
  user : {
    authenticated : boolean,
    user : {
      id: number
    }
  }
}

const mapState = (state: ComponentProps) => ({
  project: state.project,
  user : state.user
})

const mapDispatch = {
  initiliseProject: (bool: boolean) => ({type: "INIT_PROJECT", payload: bool}),
  storeProject: (details: object) => ({type: "STORE_PROJECT", payload: details}),

}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  history: any
};


const CreateProject = ({initiliseProject, history, storeProject, user}: Props) => {
    const [oldLocation , setLocation] = useState("")
    const [projectName, setProjectName] = useState("");
    const [isPublic, setPrivateOrPublic] = useState(false)
    const [formErrors, setErrors ] = useState({ name: ""})
    const [createProject] = useMutation(CREATE_PROJECT);

    var location = useLocation();
    var pathName = location.pathname

    useEffect(() => {
      if(oldLocation !== "" &&  pathName !== oldLocation) {
        initiliseProject(false)
        setLocation(pathName)
      } else {
        setLocation(pathName)
      }
    }, [pathName, oldLocation, initiliseProject])

    const openInformation = (e:any) => {
      e.preventDefault()
      console.log("open info")
    }

    const checkboxChange = () => {
      if(isPublic === true) {
        setPrivateOrPublic(false);
      }else {
        setPrivateOrPublic(true);
      }
    };


    const onChange = (e: any) => {
    setProjectName(e.target.value)
    setErrors({...formErrors, name: ""})
    }

    const onSubmit = async (e: any) => {
      e.preventDefault();

      interface Errors {
        name: string 
      }
      
      let errors: Errors = {
        name: "",
      };

      if(!projectName) {
        errors.name = "A Project Name must be entered"
      }
      if(projectName && projectName.length < 3) {
        errors.name = "Project name needs to be above 3 characters"
      }
      if(errors.name !== "") {
        setErrors(errors)
      } else {

        setErrors({ name: ""})

       const name = projectName;

       const response = await createProject({
         variables: {
          name,
          isPublic
         },
         update: (cache, { data: { createProject } }) => {
           if(createProject.error === false) {
           const cacheMyData: any = cache.readQuery({ query: MY_PROJECTS });
           if(cacheMyData !== null) {
           const udatedMyCache = [...cacheMyData.myProjects , createProject];
           cache.writeQuery({ 
            query: MY_PROJECTS,
            data : {
              myProjects : udatedMyCache
            } 
           });
          } else {
            cache.writeQuery({ 
              query: MY_PROJECTS,
              data : {
                myPosts : createProject
              } 
             });
          }
        }
        }
       }) 
       try {
        // Empty State
        if(response.data.createProject.error) {
          setErrors({ name: response.data.createProject.payload})
        } else {
          setProjectName("");
          setPrivateOrPublic(true);
          initiliseProject(false)
          const projectId = response.data.createProject.payload;
          history.push(`/workspace/${projectId}`);
        }
       } catch(err) {
        //  console.log(err);
         setErrors({ name: err})
       }
      }
    }

    return (
        <div className="create-container">
          <span className="panel-top">
            <h4>Create Project</h4>
            <button onClick={() => initiliseProject(false)} className="exit-btn">
            <img src="/assets/icons/plus/exit-dark.svg" alt="Exit panel"/>
          </button>
          </span>
          <form onSubmit={(e) => onSubmit(e)}className="create-form">
            <span className="input-wrapper">
              <label htmlFor="projectName">Name your project</label>
              <input 
                type="text" 
                id="projectName" 
                name="projectName" 
                placeholder="Project name" 
                onChange={(e) => onChange(e)}
                style={formErrors.name ? {border: "2px #f8323b solid"} : {border: "none"}}
                />
                {formErrors.name ? <p className="input-error">{formErrors.name}</p> : null}
            </span>
            <div className="input-wrapper">
              <span className="p-wrapper">
                <p>Do you want to make your project public?</p> 
                <button onClick={(e) => openInformation(e)}><img src="/assets/icons/create/info-icon.svg" alt="Information icon"/></button>
              </span> 
              <span className="checkbox-wrapper">
              <label htmlFor="publicOrPrivate">Make Public</label>
                <input type="checkbox" id="publicOrPrivate" name="publicOrPrivate" value="true"   checked={isPublic} onChange={() => checkboxChange()}/>
              </span>
            </div>
            <p className="bottom-p">Your project will be { isPublic === true ? "public" : "private"}</p>
            <input type="submit" value="Create Project" className="create-submit"/> 
            <button onClick={() => initiliseProject(false)} className="create-cancel">Cancel</button>
          </form>
      </div>
    );
}

export default withRouter(connector(CreateProject));