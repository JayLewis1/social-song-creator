import React, { useState , useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid';
// GraphQL
import { useMutation } from "@apollo/client";
import { CREATE_TAB } from "../../../graphql/mutations";
import { GET_TABS } from "../../../graphql/queries";
// Redux 
import { connect, ConnectedProps } from "react-redux";
// Component Props and their types
interface ComponentProps {
  workspace: {
    tabInit: boolean
  }
  project: {
    currentProject: string
  }
}

const mapState = (state : ComponentProps) => ({
  currentProject: state.project.currentProject,
  tabInit: state.workspace.tabInit
})
const mapDispatch = {
  initTabCreation : (bool: boolean) => ({type: "INIT_AND_EXIT_TAB_CREATION", payload: bool})
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

 

 const CreateTab = ({initTabCreation , currentProject}: Props) => {
   const [tabArray, initTabArray] = useState([]);
   const [description, setDescription] = useState({description : ""});
   const [disable, disableSubmitBtn] = useState(false);
   const [createTab] = useMutation(CREATE_TAB);

   // Used to set the correct value to the related select 
   var index = 0;
   useEffect(() => {
     // Populate array state so it can be rendered properly in the form
     // x = rows indictaing the strings on the guitar
     // y = columns indictating frets on a guitar neck
     if(tabArray.length < 1) {
      let initialArray: any = []
      for(var y = 0 ; y < 6 ; y++) {
        for(var x = 0 ; x <= 10; x++) {
          initialArray.push("")
        }
      }
      initTabArray(initialArray);
     }
   }, [tabArray])

  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setDescription({...description, description: e.target.value})
  }

  const onTabChange = () => {
    disableSubmitBtn(true);
    var newArray: any = [];
    var i = 0;
    // Loop through the 6 x 11 "grid"
    for(var y = 0 ; y < 6 ; y++) {
      for(var x = 0 ; x <= 10; x++) {
        // Assign note variable with each select element
        var note: any = document.getElementsByClassName("tab-note")[i];
        // Assign val the note value then push to array
        var val = note.value;
        newArray.push(val);
        // increment i
        i++;
      }
    } 
    // Assign the new array to the tabArray state
    initTabArray(newArray)
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    // Adding tab with our createTab mutation and updating cache
    await createTab({
      variables : {
        projectId: currentProject,
        tab: tabArray,
        description : description.description
      },
      update: ( cache, { data: { createTab } }) => {
        // Updating the GET_TABS cache with createTab result
        const cacheTabs: any = cache.readQuery({
          query: GET_TABS,
          variables : {
              projectId: currentProject
            },
        });

        let newTabArray = [...cacheTabs.tabs, createTab]
        cache.writeQuery({
          query: GET_TABS,
          variables : {
            projectId: currentProject
          },
          data : {
            tabs: newTabArray
          }
        })
      }
    }) 
      try{
      // Close Creation panel
      initTabCreation(false); 
      // Resest initial array with empty strings
      let initialArray: any = [];
      setDescription({description : ""});
      for(var y = 0 ; y < 6 ; y++) {
        for(var x = 0 ; x <= 10; x++) {
          initialArray.push("")
        }
      }
      initTabArray(initialArray);
      } catch(err) {
        console.log(err);
      }
    }
  
  return (
    <div className="create-container workspace-create">
        <span className="panel-top">
              <h4>Create Tab</h4>
              <button onClick={() => initTabCreation(false)} className="exit-btn">
              <img src="/assets/icons/plus/exit-dark.svg" alt="Exit panel"/>
            </button>
        </span>
      <form className="create-form" onSubmit={(e) => onSubmit(e)}>
        <span className="input-wrapper">
          <label htmlFor="description">Tab Description</label>
          <input 
            type="text" 
          
            name= "description"
            id= "description"
            placeholder="Give this tab a description e.g. intro, solo etc"
            onChange={(e) => onChange(e)}/>
        </span>
      <div className="select-grid">
        {tabArray.map(() => (
        <select 
          name="tab-note" 
          className="tab-note"  
          value={tabArray[index++]}
          key={uuidv4()}
          onChange={() => onTabChange()} 
         >
          <option value=""></option>
          <option value="x">x</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
          <option value="24">24</option>
        </select>
        ))}
        </div>
        <input type="submit" id="submit-lyric" value="Create Tab" className="create-submit" disabled={!disable}/>
      </form>
    </div>
  )
}
export default connector(CreateTab);