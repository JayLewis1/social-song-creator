import React, { useEffect, useState, Fragment } from 'react'
import { Link } from "react-router-dom"
// GrahphQL
import { useQuery, useMutation } from "@apollo/client";
import { SEARCH_MATES_FOR_CONTRIBUTORS , GET_CONTRIBUTORS, CURRENT_PROJECT, MY_ACCOUNT} from "../../../graphql/queries"
import { ADD_CONTRIBUTOR , SEND_NOTIFICATION} from "../../../graphql/mutations";
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components
import RemoveContributor from "./RemoveContributor";

interface ComponentProps {
  user : {
    user: {
      id: number
    }
  }
  project : {
    contributor:  {
      remove: boolean
      userId: number
    }
    selectedProject: string
  }
}

const mapState = (state: ComponentProps) => ({
  id: state.user.user.id,
  contributor: state.project.contributor,
  selectedProject: state.project.selectedProject
})

const mapDispatch = {
  toggleContributors : (payload: boolean) => ({type: "TOGGLE__CONTRIBUTORS", payload: payload}),
  removeContributors : (payload: object) => ({type: "REMOVE_CONTRIBUTOR", payload: payload})
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux 


const ContributorPanel = ({selectedProject, contributor, id, removeContributors, toggleContributors} :Props) => {
  const [searchName, setSearchData] = useState({ name: ""});
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT)
  const { data: userData, loading: userLoading } = useQuery(GET_CONTRIBUTORS, {
    variables : {
      projectId: selectedProject
    }
  })
  const { data: projectData, loading: projectLoading } = useQuery(CURRENT_PROJECT, {
    variables : {
      projectId: selectedProject
    }
  })
  const { data: searchData, loading: searchLoading} = useQuery(SEARCH_MATES_FOR_CONTRIBUTORS, {
    variables : {
      projectId: selectedProject,
      name: searchName.name
    }
  })
  const [addContributor] = useMutation(ADD_CONTRIBUTOR)
  const [sendNotfication] = useMutation(SEND_NOTIFICATION);

  useEffect(() => {
    return () => {
      toggleContributors(false)
    } 
  },[toggleContributors])


  const addContributorFunc = async (mateId: number) => {
        // Adding contributor with useMutatiion
        // Updating cache so we can see the change in realtime in our ui
       await  addContributor({
          variables : {
            projectId : selectedProject,
            userId: mateId
        },
        update: (cache , { data: { addContributor } }) => {
            // Updating our GET_CONTRIBUTORS cache with the response data which is the current project
            cache.writeQuery({
              query: GET_CONTRIBUTORS,
              variables : {
                projectId: selectedProject
              },
              data: {
                contributors: addContributor
              }
            })
            // Read the cache for SEARCH_MATES query
            const searchCache: any = cache.readQuery({query: SEARCH_MATES_FOR_CONTRIBUTORS,
              variables : {
                projectId: selectedProject,
                name: searchName.name
              }})
            // Assign and iterate the cache to a new variable so we can mofidy
            let modifiedCache = [...searchCache.searchMatesForContributors]
            let index: number;
            // Loop through the searchMatesForContributors cache and the addContributor response
            for(let x = 0; x < modifiedCache.length; x++) {
              for(let y = 0 ; y < addContributor.length; y ++) {
                // Find the contributors and splice them from modified array
                if(addContributor[y].id === modifiedCache[x].id) {
                  index = modifiedCache.indexOf(modifiedCache[x]);
                  modifiedCache.splice(index!, 1);
                }
              }
            }
            // Update cache with our modified array
            cache.writeQuery({
              query: SEARCH_MATES_FOR_CONTRIBUTORS,
              variables : {
                projectId: selectedProject,
                name: searchName.name
              },
              data: {
                 searchMatesForContributors: modifiedCache
                }
            })
        }
      })
    try {
  await sendNotfication({
        variables : {
            recipient: mateId,
            type: "contributor",
            message: `added you as a contributor to ${projectData.currentProject.name} /${projectData.currentProject.id}`
        }
      })

    } catch (err) {
        console.log(err)
    }
    } 

    const setRemoveContributor = (id: number) => {
      let dataToSend;
      if(contributor.remove === true && contributor.userId === id) {
         dataToSend = {
          remove: false,
          projectId : selectedProject,
          userId: id
        }
      } else {
         dataToSend = {
          remove: true,
          projectId : selectedProject,
          userId: id
        }
      }
  
      // Send dataToSend with redux
      removeContributors(dataToSend);
    }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchData({...searchName, name: e.target.value})
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  } 

  const closePanel = () => {
    toggleContributors(false);
  }

  return (
    <div className="contributor-container">
    <div className="contributor-panel">
      <span className="panel-heading">
        <p>Contributors</p>
      </span>
      <ul>
        { !userLoading && userData && userData.contributors && userData.contributors.map((user: any) => 
        <li key={user.id}>
          <div className="remove-bg" style={contributor.remove === true && contributor.userId === user.id ? {minWidth: "100%", maxWidth:"100%"} : { minWidth: "0%", maxWidth:"0%"} }>
            <RemoveContributor />
          </div>
          <img src={user.avatar} alt="Profile Avatar"/>
          <Link className="user-link" to={`/profile/${user.id}`}>
            <p>{user.firstName}</p>
            <p className="hover-show">See profile</p>
          </Link>
          {!meLoading && !projectLoading && meData.me.id === projectData.currentProject.creatorId && 
            <Fragment>
              { meData.me.id !== user.id && 
              <button onClick={() => setRemoveContributor(user.id)} className="remove-contributor">
                <p>Remove</p> 
              </button>}
            </Fragment>
        }
        </li>) }
      </ul>
      <form onSubmit={(e) => onSubmit(e)}>
          <label htmlFor="mateSearch">Search mates</label>
          <span className="input-wrapper">
            <input 
              type="text"
              id="mateSearch" 
              name="mateSearch"
              placeholder="Enter mate's name"
              onChange={(e) => onChange(e)}/>
              <button className="search-btn">
                <img src="/assets/icons/menu/search-blue.svg" alt="Submit"/>
              </button>
          </span>
      </form>
      <ul className="mates-on-contributors">
        { !searchLoading && searchData && searchData.searchMatesForContributors.length !== 0 && searchData.searchMatesForContributors.map((user: any) => 
          <li key={user.id}>
              <img src={user.avatar} alt="Profile Avatar"/>
              <Link className="user-link" to={`/profile/${user.id}`}>
              <p>{user.firstName}</p>
              <p className="hover-show">See profile</p>
              </Link>
              <button onClick={() => addContributorFunc(user.id)} className="add-btn">
                <p>Add</p> 
              </button>
            </li> 
        )}
      </ul>
      <button className="exit-btn" onClick={() => closePanel()}>
        <p>Exit</p>
      </button>
    </div>
  </div>
  )
}
export default connector(ContributorPanel);