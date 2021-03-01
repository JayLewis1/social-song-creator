import React, { useState } from "react"

import { useQuery, useMutation } from "@apollo/client";
import { MY_ACCOUNT } from "../../../graphql/queries";
import { UPDATE_INSTRUMENTS } from "../../../graphql/mutations";

// Redux
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {  
  }
  
  const mapState = (state: ComponentProps) => ({})
  
  const mapDispatch = {
    editInstrument: (payload: boolean) => ({type: "EDIT_INSTRUMENT", payload: payload}),
  }
  
  const connector = connect(mapState,mapDispatch);
  
  type PropsFromRedux = ConnectedProps<typeof connector>;
  type Props = PropsFromRedux

const Instruments = ({editInstrument}: Props) => {
  const { data } = useQuery(MY_ACCOUNT);
  const [formData, setFormData] = useState({  instruments: data.me.instruments,
  });
  const [UpdateInstruments] = useMutation(UPDATE_INSTRUMENTS);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name] : e.target.value})
  }

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(formData.instruments === "") {
      console.log(formData)
      UpdateInstruments({
        variables : {
          id: data.me.id,
          instruments: " ",
        }
      })
      editInstrument(false);
    } else { 
      console.log(formData)
      UpdateInstruments({
        variables : {
          id: data.me.id,
          instruments: formData.instruments ,
        }
      })
      editInstrument(false);
    }
  }

  return (
    <form onSubmit={(e) => onSubmit(e)} className="edit-form">
      <span className="instruments-wrapper">
        <label htmlFor="instruments" className="label">Instruments</label>
        <input
        type="text" 
        name="instruments"
        value={formData.instruments}
        onChange={(e) => onChange(e)} />
      </span>
        <input type="submit" value="Submit"/>
      <button type="button" className="edit-profile" onClick={() => editInstrument(false)}>
        <img src="/assets/icons/plus/cross-red.svg" alt="close"/>
      </button>
    </form>   
  )
}

export default connector(Instruments);