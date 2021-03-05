import React , {Fragment , useEffect, useState} from 'react'
import { Link, withRouter, useLocation } from "react-router-dom";
// GraphQL
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT_USER } from "../../graphql/mutations"
import { MY_ACCOUNT } from "../../graphql/queries"
// Components
import { setAccessToken } from '../../accessToken';
// Redux
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {

}

const mapState = (state: ComponentProps) => ({

})

const mapDispatch = {
  logoutUser: () => ({ type: "CLEAR_USER", payload: false}),
  closeSettingsPanel : (payload: boolean) => ({ type: "CLOSE_SETTINGS_PANEL", payload: payload })
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  history: any
}

const AccountOptions = ({logoutUser, closeSettingsPanel , history} :Props) => {
  const [oldLocation , setLocation] = useState("")
  const [logout, { client }] = useMutation(LOGOUT_USER);
  const { data, loading } = useQuery(MY_ACCOUNT);
 
  var location = useLocation();
  var pathName = location.pathname

  useEffect(() => {
    if(oldLocation !== "" &&  pathName !== oldLocation) {
      closeSettingsPanel(false)
      setLocation(pathName)
    } else {
      setLocation(pathName)
    }
  }, [pathName, oldLocation, closeSettingsPanel])

  
  const logoutUserFunction = async () => {
  logoutUser();
   await logout();
   try{
    closeSettingsPanel(false);
    setAccessToken("");
    history.push("/login")
    await client.resetStore();
   }catch(err) {
     console.log(err);
   }
  }
    return (
      <div className="account-options-dropdown">
        <span className="top-wrapper">
          { !loading && data && data.me &&
          <Fragment >
          <img src={data.me.avatar} className="avatar" alt="Users Avatar"></img>
          <p>{ data.me.firstName + " " + data.me.lastName }</p>
          </Fragment>
        }
        </span>
        <ul>
        <li><img src="/assets/icons/menu/profile.svg" className="account-icons"alt="Profile Icon"/><Link to="/profile/me">Profile</Link></li>
        <li><img src="/assets/icons/menu/settings.svg" className="account-icons" alt="Settings Icon"/><Link to="/settings">Settings</Link></li>
          <li><img src="/assets/icons/menu/logout.svg"className="account-icons"  alt="Logout Icon"/><button onClick={() => logoutUserFunction()}>Logout</button></li>
        </ul>
      </div>
    );
}

export default withRouter(connector(AccountOptions));