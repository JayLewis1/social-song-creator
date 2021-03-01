import React, { useState } from "react"

import { useQuery, useMutation } from "@apollo/client";
import { MY_ACCOUNT } from "../../../graphql/queries";
import { UPDATE_BIO } from "../../../graphql/mutations";

// Redux
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {  
  }
  
  const mapState = (state: ComponentProps) => ({})
  
  const mapDispatch = {
    editBio: (payload: boolean) => ({type: "EDIT_BIO", payload: payload}),
  }
  
  const connector = connect(mapState,mapDispatch);
  
  type PropsFromRedux = ConnectedProps<typeof connector>;
  type Props = PropsFromRedux

const Bio = ({editBio}: Props) => {
  const { data } = useQuery(MY_ACCOUNT);
  const [formData, setFormData] = useState({  bio: data.me.bio,
  });
  const [updateBio] = useMutation(UPDATE_BIO);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name] : e.target.value})
  }

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateBio({
      variables : {
        bio: formData.bio  
      }
    })
    editBio(false);
    // if(formData.bio === "") {
    //   updateBio({
    //     variables : {
    //       bio: "" 
    //     }
    //   })
    //   editBio(false);
    // } else { 
    //   updateBio({
    //     variables : {
    //       bio: formData.bio  
    //     }
    //   })
    //   editBio(false);
    // }
  }

  return (
    <form onSubmit={(e) => onSubmit(e)} className="edit-form">
      <span className="bio-wrapper">
        <label htmlFor="bio" className="label">Bio</label>
        <textarea 
        name="bio"
        value={formData.bio}
        onChange={(e) => onChange(e)} />
      </span>
        <input type="submit" value="Submit"/>
      <button type="button"  className="edit-profile" onClick={() => editBio(false)}>
        <img src="/assets/icons/plus/cross-red.svg" alt="close"/>
      </button>
    </form>   
  )
}

export default connector(Bio);