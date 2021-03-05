import React from 'react'
import { useMutation } from "@apollo/client"
import { REMOVE_CONTRIBUTOR } from "../../../graphql/mutations"
import { GET_CONTRIBUTORS, SEARCH_MATES_FOR_CONTRIBUTORS } from "../../../graphql/queries"
// Redux
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {  
  project : {
    contributor : {
      projectId: string
      userId: number
    }
  }
}

const mapState = (state: ComponentProps) => ({
  contributor: state.project.contributor
})

const mapDispatch = {
  removeContributors : (payload: object) => ({type: "REMOVE_CONTRIBUTOR", payload: payload})
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

const RemoveContributor = ({removeContributors, contributor}: Props) => {
  const [removeContributor] = useMutation(REMOVE_CONTRIBUTOR);

  const removeFunc = async () => {
    await removeContributor({
      variables : {
        projectId: contributor.projectId,
        userId: contributor.userId 
      },
      update: (cache, { data : { removeContributor }}) => {
        // Read the cache for SEARCH_MATES query
        const conCache: any = cache.readQuery({query: GET_CONTRIBUTORS,
          variables : {
            projectId: contributor.projectId,
          }})
          // Assign variable with the cached array so we can modify
          let modConCache = [...conCache.contributors];
          // Loop through the cache and find the removed user
          for(let a = 0; a < modConCache.length; a++) {
            if(modConCache[a].id === removeContributor.id) {
              // Find index of the removed user and then splice from array
              let index = modConCache.indexOf(modConCache[a]);
              modConCache.splice(index, 1)
            }
          }
          // Update cache
          cache.writeQuery({
            query : GET_CONTRIBUTORS,
            variables : {
              projectId: contributor.projectId,
            },
            data: {
              contributors : modConCache
            }
          })
          // Read the cache for SEARCH_MATES query
          const searchCache: any = cache.readQuery({query: SEARCH_MATES_FOR_CONTRIBUTORS,
            variables : {
              projectId: contributor.projectId,
              name: ""
            }})

          // Assign the cache to new array and add the removed user also
          if(searchCache !== null) {
            let modifiedCache = [...searchCache.searchMatesForContributors, removeContributor ]
            // Update cache with our modified array
            cache.writeQuery({
              query: SEARCH_MATES_FOR_CONTRIBUTORS,
              variables : {
                projectId: contributor.projectId,
                name: ""
              },
              data: {
                searchMatesForContributors: modifiedCache
                }
            })
          }
      }
    })
    try{
      removeContributors({
        remove: false,
        projectId : "",
        userId: -1
      })
    }catch(err) {
      console.log(err);
    }
  }

  const closeValidation = () => {
    // Redux function
    removeContributors({
          remove: false,
          projectId : "",
          userId: -1
        })
  }

  return (
      <span className="btn-wrapper">
        <button onClick={() => removeFunc()}className="remove-btn">
          <span className="btn-bg"></span>
          <p>Remove</p>
        </button>
        <button onClick={() => closeValidation()}className="cancel-btn">
          <span className="btn-bg"></span>
          <p>Cancel</p>
        </button>
      </span>
  )
}


export default connector(RemoveContributor);