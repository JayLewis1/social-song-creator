import React, { useState } from "react"

import { useQuery, useMutation } from "@apollo/client";
import { MY_ACCOUNT } from "../../../graphql/queries";
import {UPDATE_NAMES_AND_DOB } from "../../../graphql/mutations";

// Redux
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {  
  }
  
  const mapState = (state: ComponentProps) => ({})
  
  const mapDispatch = {
    editNames: (payload: boolean) => ({type: "EDIT_NAME", payload: payload}),
  }
  
  const connector = connect(mapState,mapDispatch);
  
  type PropsFromRedux = ConnectedProps<typeof connector>;
  type Props = PropsFromRedux

const NamesDob = ({editNames}: Props) => {
  const [formErrors , setErrors] = useState({ firstName: "", lastName: "", dob:""})
  const [dobErrors, setDobErrors] = useState({
    day: "",
    month: "",
    year: "",
    all: ""
})
  const { data } = useQuery(MY_ACCOUNT);
  const [UpdateNamesAndDob] = useMutation(UPDATE_NAMES_AND_DOB);    

  
 const dobArray = data.me.dob.split(" ");
  var day = dobArray[0];
  var month = dobArray[1];
  var year = dobArray[2];


  const [formData, setFormData] = useState({
    firstName: data.me.firstName,
    lastName :  data.me.lastName,
    day : day,
    month: month,
    year: year
  });


  const onChange = (e:any) => {
    setFormData({...formData, [e.target.name] : e.target.value})
  }

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    var errors = {
      firstName: "",
      lastName: "",
      dob: ""
    }

    if(formData.firstName === "") {
      errors.firstName = "First name can't be left empty"
    }
    if(formData.lastName === "") {
      errors.lastName = "Last name can't be left empty"
    }
    if(formData.day === "" || formData.month === "" || formData.year === "") {
      errors.dob = "Date of birth can't be left empty"
    }

    if(errors.firstName === "" && errors.lastName === "" &&  errors.dob === "") {
      const dob = formData.day + " " + formData.month + " " + formData.year;
  
      UpdateNamesAndDob({
        variables : {
          id: data.me.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dob
        }
      })
      editNames(false);
    } else { 
      setErrors(errors);
    }
  }

  return (
    <form onSubmit={(e) => onSubmit(e)} className="edit-form">
    <div className="name-email-wrapper">
        <span>
            <label htmlFor="firstName" className="label">First Name</label>
            <input 
              type="text" 
              name="firstName"
              value={formData.firstName}
              onChange={(e) => onChange(e)} />
              { formErrors.firstName && <p className="input-error">{formErrors.firstName}</p> }
        </span>
        <span>
          <label htmlFor="lastName"className="label">Last Name</label>
          <input 
              type="text" 
              name="lastName"
              value={formData.lastName}
              onChange={(e) => onChange(e)} />
              { formErrors.lastName && <p className="input-error">{formErrors.lastName}</p> }
        </span>
        <span className="email-container">
            <p className="label">Email</p>
            <p className="profile-info">{data.me.email}</p> 
        </span>
    </div>
    <span>
                        <span className="dob-wrapper">
                            <span className="dob-inputs day-wrapper">
                                <label htmlFor="day">Day</label>
                                <input 
                                    type="text"
                                    name="day" 
                                    value={formData.day} 
                                    className="dob-input"
                                    id="day"
                                    placeholder="DD"
                                    maxLength={2}
                                    style={  formErrors.dob ? {border: "2px solid #F84061"} : {border: "none"} }
                                    onChange={e => onChange(e)}/>
                            </span>
                            <span className="dob-inputs month-wrapper">
                                <label htmlFor="month-edit">Month</label>
                                <select 
                                    name="month" 
                                    id="month-edit" 
                                    required
                                    aria-invalid="true"
                                    style={  formErrors.dob || dobErrors.month !== "" ? {border: "2px solid #F84061"} : {border: "none"} }
                                    onChange={e => onChange(e)} defaultValue={formData.month}>
                                    <option selected disabled value="month"> Month</option>
                                  
                                    <option value="January">January</option>
                                    <option value="February">February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select>
                            </span>
                                <span className="dob-inputs year-wrapper">
                                <label htmlFor="year">Year</label>
                                <input 
                                    type="text" 
                                    name="year" 
                                    value={formData.year} 
                                    className="dob-input"
                                    id="year"
                                    placeholder="YYYY"
                                    maxLength={4}
                                    style={formErrors.dob ? {border: "2px solid #F84061"} : {border: "none"} }
                                    onChange={e => onChange(e)}/>
                            </span>
                        </span>
                        { formErrors.dob && <p className="input-error">{formErrors.dob}</p> }
                    </span>
        <input type="submit" value="Submit"/>
    <button type="button" className="edit-profile" onClick={() => editNames(false)}>
            <img src="/assets/icons/plus/cross-red.svg" alt="close"/>
    </button>
    </form>   
  )
}

export default connector(NamesDob);