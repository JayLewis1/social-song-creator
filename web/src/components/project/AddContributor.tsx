import React, { useState, useEffect, useCallback } from 'react'
import { Link } from "react-router-dom"
// GrahphQL
import { useQuery, useMutation } from "@apollo/client";
import { SEARCH_MATES_FOR_CONTRIBUTORS , GET_CONTRIBUTORS, CURRENT_PROJECT, MY_ACCOUNT} from "../../graphql/queries"
import { ADD_CONTRIBUTOR , SEND_NOTIFICATION} from "../../graphql/mutations";
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
  }
}

const mapState = (state: ComponentProps) => ({
  id: state.user.user.id,
  contributor: state.project.contributor
})

const mapDispatch = {
  toggleContributors : (payload: boolean) => ({type: "TOGGLE__CONTRIBUTORS", payload: payload}),
  removeContributors : (payload: object) => ({type: "REMOVE_CONTRIBUTOR", payload: payload})
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  currentProject : string
};


const AddContributor = ({ removeContributors, contributor, toggleContributors, id, currentProject} :Props) => {
  const [searchName, setSearchData] = useState({ name: ""});
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT)
  const { data: userData, loading: userLoading } = useQuery(GET_CONTRIBUTORS, {
    variables : {
      projectId: currentProject
    }
  })
  const { data: projectData, loading: projectLoading } = useQuery(CURRENT_PROJECT, {
    variables : {
      projectId: currentProject
    }
  })
  const { data: searchData, loading: searchLoading} = useQuery(SEARCH_MATES_FOR_CONTRIBUTORS, {
    variables : {
      projectId: currentProject,
      name: searchName.name
    }
  })
  const [addContributor] = useMutation(ADD_CONTRIBUTOR)
  const [sendNotfication] = useMutation(SEND_NOTIFICATION);
  const addContributorFunc = async (mateId: number) => {
        // Adding contributor with useMutatiion
        // Updating cache so we can see the change in realtime in our ui
       await  addContributor({
          variables : {
            projectId : currentProject,
            userId: mateId
        },
        update: (cache , { data: { addContributor } }) => {
            // Updating our GET_CONTRIBUTORS cache with the response data which is the current project
            cache.writeQuery({
              query: GET_CONTRIBUTORS,
              variables : {
                projectId: currentProject
              },
              data: {
                contributors: addContributor
              }
            })
            // Read the cache for SEARCH_MATES query
            const searchCache: any = cache.readQuery({query: SEARCH_MATES_FOR_CONTRIBUTORS,
              variables : {
                projectId: currentProject,
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
                projectId: currentProject,
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
          projectId : currentProject,
          userId: id
        }
      } else {
         dataToSend = {
          remove: true,
          projectId : currentProject,
          userId: id
        }
      }
  
      // Send dataToSend with redux
      removeContributors(dataToSend);
    }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchData({...searchName, name: e.target.value})
  }

  return (
    <div className="contributor-panel">
      <ul>
        { !userLoading && userData && userData.contributors && userData.contributors.map((user: any) => 
        <li key={user.id}>
          <img src={user.avatar} alt="Profile Avatar"/>
          <Link className="user-link" to={`/profile/${user.id}`}>{user.firstName}</Link>
          { !meLoading && meData && meData.me.id !== user.id && 
            <button onClick={() => setRemoveContributor(user.id)} className="remove-contributor">
              <img src="/assets/icons/post/red-cross.svg" alt="Remove Contributor"/>
            </button>
          }
          {contributor.remove === true && contributor.userId === user.id && <RemoveContributor /> }
        </li>) }
      </ul>
      <form>
          <label htmlFor="mateSearch">Add contributors</label>
          <span>
            <input 
              type="text"
              id="mateSearch" 
              name="mateSearch"
              placeholder="Enter mate's name"
              onChange={(e) => onChange(e)}/>
              <input type="image" src="/assets/icons/menu/search.svg" alt="Submit"/>
          </span>
      </form>
      <ul className="mates-on-contributors">
        { !searchLoading && searchData && searchData.searchMatesForContributors.length !== 0 && searchData.searchMatesForContributors.map((user: any) => 
          <li key={user.id}>
              <img src={user.avatar} alt="Profile Avatar"/>
              <Link className="user-link" to={`/profile/${user.id}`}>{user.firstName}</Link>
              <button onClick={() => addContributorFunc(user.id)}>Add</button>
            </li> 
        )}
      </ul>
    </div>
  )
}
export default connector(AddContributor);