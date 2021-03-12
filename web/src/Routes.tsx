import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route , Redirect, useLocation} from "react-router-dom";

// GraphQL 
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT } from "./graphql/queries";

// Redux 
import { connect, ConnectedProps } from "react-redux";

import Login from './routes/login-register/Login';
import Register from './routes/login-register/Register';

// Components 
import Header from "./components/header/Header";
import Playbar from "./components/playbar/Playbar";
import Navigation from "./components/navigation/Navigation";
import CreatePost from './components/post/functions/CreatePost';
import CreateProject from './components/project/functions/CreateProject';
import AuthRoute from "./components/authRoute/AuthRoute";
import UnAuthRedirect from "./components/unAuthRedirect/UnAuthRedirect"
import UserProfile from "./components/profile/user/UserProfile"
import ScrollToTop from "./components/scrollToTop/ScrollToTop"
import RequestResult from "./components/request/RequestResult";
// Routes
import Feed from './routes/feed/Feed';
import Workspace from './routes/workspace/Workspace';
import MyMates from './routes/myMates/MyMates';
import Profile from './routes/profile/Profile';
import Projects from './routes/projects/Projects';
import NotFound from './routes/notFound/NotFound';
import Landing from "./routes/landing/Landing";
import Discover from "./routes/discover/Discover";
import SearchResult from "./routes/searchResult/SearchResult";

interface ComponentProps {
  application : {
      location: string
      postPanel : boolean
      projectPanel : boolean
      result: {
        show: boolean
        success: boolean
        type: string
      }
  }  
  user: {
    authenticated : boolean,
    user : {}
  }
  // project: {
  //   projectPanel : boolean,
  //   projectDetails : {}
  // }
}

const mapState = (state : ComponentProps) => ({
  authenticated : state.user.authenticated,
  location: state.application.location,
  projectPanel: state.application.projectPanel,
  postPanel : state.application.postPanel,
  result: state.application.result
})

const mapDispatch = {
  activatePlaybar : (val:Boolean) => ({type: "OPEN_PLAYBAR", payload: val}),
  authenticateUser: (user: object) => ({ type: "USER_AUTHENTICATED", payload: user}),
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux


// Component 
const Routes = ({location, projectPanel, authenticated, result, postPanel, activatePlaybar, authenticateUser} : Props) => {
  const { data , loading } = useQuery(MY_ACCOUNT);

  useEffect(() => {
    if(!loading && data && data.me) {
      const contructedUserData = {
        id : data.me.id,
        email: data.me.email,
    }
    authenticateUser(contructedUserData);
    }
    if(!loading && location !== "workspace") {
      activatePlaybar(false);
    } else if(!loading && location === "workspace") {
      activatePlaybar(true);
    }
  }, [location, data, loading, activatePlaybar, authenticateUser])
  
    return (
      <Router>

         {authenticated === true ? 
         <div className="app">
         <Header />
         <div className={location !== "workspace" ? "app-wrapper" : "app-workspace-wrapper"} > 
         {location === "workspace" ?  null : <Navigation></Navigation>}
         {postPanel === true ? <CreatePost/> : null}
         {projectPanel === true ? <CreateProject/> : null}
         {result.show === true ? <RequestResult /> : null}
         <ScrollToTop />
           <Switch>
             <Route exact path="/">
               <Redirect to="/feed"></Redirect> 
            </Route> 
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/" /> 
            <Route exact path="/feed" component={Feed} />
            <Route exact path="/discover" component={Discover} />
             <Route exact path="/workspace/:id" component={Workspace} />
             <Route exact path="/profile/me" component={Profile} />
             <Route exact path="/projects" component={Projects} />
             <Route exact path="/mates" component={MyMates} />
             <Route exact path="/search/:input" component={SearchResult} />
             <Route exact path="/profile/:id" component={UserProfile} />
             <Route component={NotFound} />
           </Switch>
         </div>
         <Playbar></Playbar>
       </div> 
       :
        <div className="landing">
              <ScrollToTop />
          <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              {/* <Route component={NotFound} /> */}
              {/* <Route exact path="/login" component={UnAuthRedirect} />
              <Route exact path="/register" component={UnAuthRedirect} />
              <Route exact path="/feed" component={UnAuthRedirect} />
              <Route exact path="/discover" component={UnAuthRedirect} />
              <Route path="/workspace/" component={UnAuthRedirect} />
              <Route path="/profile/" component={UnAuthRedirect} />
              <Route exact path="/projects" component={UnAuthRedirect} />
              <Route exact path="/mates" component={UnAuthRedirect} /> */}
          </Switch>
        </div>
         }
      </Router>
    )
}

export default connector(Routes);
