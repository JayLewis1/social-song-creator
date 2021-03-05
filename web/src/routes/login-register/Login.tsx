import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
 
// GraphQL
import { useQuery, useMutation} from "@apollo/client";
import { MY_ACCOUNT } from "../../graphql/queries";
import { LOGIN_USER } from "../../graphql/mutations";
// Redux 
import { connect, ConnectedProps } from "react-redux";
// Components
import { setAccessToken } from '../../accessToken';



const mapDispatch = {
    authenticateUser: (user: object) => ({ type: "USER_AUTHENTICATED", payload: user})
  }
const connector = connect(null, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
    history: any,
    client: any
}


const Login = ({history, client, authenticateUser}: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [ emailErrors, setEmailErrors ] = useState("")
    const [ passwordErrors, setPasswordErrors ] = useState("")
    const [loggingIn, setLogging] = useState(false);
    const [passwordType, setPasswordType] = useState("password")
    const [showOrHide, setShowOrHide] = useState("show")
    const [login] = useMutation(LOGIN_USER);
    const { data, loading } = useQuery(MY_ACCOUNT);    
     
    useEffect(() => {
        if(loggingIn === false && !loading && data && data.me) {
            history.push("/")
        }
    },[loggingIn,loading, data, history])
    
    if(loading) {
        return <div>...Loading</div>
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("login clicked");
        setLogging(true);
        if(email === "") {
            setEmailErrors("You must enter an email address");
        } 
        if(password === "") {
            setPasswordErrors("You must enter a password");
        } 
        if(email !== "" && password !== "") {
          const response = await login({
                variables: {
                    email: email.toLowerCase(),
                    password: password,
                },
                update: (cache, { data: { login } } ) => {
                    if (!login) {
                        return null
                      }
                //Update cache with the login data 
                cache.writeQuery({ 
                    query: MY_ACCOUNT,
                    data : {
                    me : login.user
                    } 
                });
                }
                })
           
                try {
                    // If there are any errors handle properly
                    if(response.data.login.error) {
                        if(response.data.login.errorType === "user") {
                            setEmailErrors("Could not find user");
                        } else if(response.data.login.errorType === "password") {
                            setPasswordErrors("Incorrect password");
                        }
                    }
                    
                    if (response.data.login.user) {
                        setAccessToken(response.data.login.accessToken)
                        authenticateUser(response.data.login.user);
                        history.push("/feed")
                      }

                } catch(err) {
                    console.log(err)
                }
            // .then((res) => {
            //     setAccessToken(res.data.login.accessToken);
            //     const contructedUserData = {
            //         id : res.data.login.user.id,
            //         email: res.data.login.user.email,
            //     }
            //    
            // })
            // .then(() =>  {
            //     // const updateQuery = client.writeQuery({ 
            //     //     query: MY_ACCOUNT,
            //     //     data : {
            //     //     me : responseData.user
            //     //     } 
            //     // });
            //     // console.log(responseData)
            //     // console.log(updateQuery)
            //     history.push("/feed")
            //     setLogging(false)})
            // .catch(err => {
            //     setEmailErrors("Incorrect username or password")
            //     setPasswordErrors("Incorrect username or password")
            //     console.log(err.message);
            // })
        }
    }

    const showPassword = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if(passwordType === "password") {
            setPasswordType("text")
            setShowOrHide("hide")
        } else {
            setPasswordType("password")
            setShowOrHide("show")
        }
    }


    return (
        <div className="login-container">
            <h1>SocialSongs</h1>
            <h2>To enter, log in with your details below.</h2>
            <form onSubmit={(e) => onSubmit(e)}>
                <span>
                    <label htmlFor="email">Email address</label>
                    <input 
                        type="text" 
                        name="email" 
                        value={email} 
                        placeholder="Email Address"
                        onChange={e => {
                            setEmail(e.target.value);
                        }}
                        style={emailErrors ? {border: "2px solid #F84061"} : {border: "none"}}/>
                        { emailErrors && <p className="input-error">{emailErrors}</p> }
                </span>
                <span>
                    <label htmlFor="password">Password</label>
                    <input 
                        type={passwordType} 
                        name="password" 
                        value={password} 
                        placeholder="Enter password"
                        onChange={e => {
                            setPassword(e.target.value);
                        }}
                        style={passwordErrors ? {border: "2px solid #F84061"} : {border: "none"}}/>  
                        { passwordErrors && <p className="input-error">{passwordErrors}</p> }
                        <button id="show-password" onClick={(e) => showPassword(e)}>
                                <img src={`/assets/icons/validate/${showOrHide}-password.svg`} alt="Show/hide password"/>
                        </button>
                    <Link to="/" className="forgotPassword">Forgot your password?</Link>
                </span>
              
                <span>
                <input type="submit" value="Login" className="submit-btn"/>
                </span>
                <div className="line-breaker"></div>
                <p className="no-account">Don't have an account?</p>
                <Link className="register-link"to="/register">
                    Sign up to SocialSongs
                </Link>
            </form>
                        
        </div>
    );
}

export default connector(Login);