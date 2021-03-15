import React, { useEffect, useState, Fragment, useRef } from 'react'
import { Link, withRouter} from "react-router-dom"
// GraphQL
import { useMutation, useQuery } from "@apollo/client";
import { MY_ACCOUNT } from "../../graphql/queries";
import { REGISTER_USER , LOGIN_USER } from "../../graphql/mutations";
// Components
import { setAccessToken } from '../../accessToken';

interface ComponentProps {
    history: any
}

const Register = ({history}: ComponentProps) => {
    const [loggingIn, setLogging] = useState(false);
    const [formData, setFormData] = useState({
        email : "", 
        password: "",
        firstName: "",
        lastName: "",
        day: "",
        month: "",
        year: "" });
    const [passwordErrors , setPasswordErrors] = useState("");
    const [emailError, setEmailError] = useState("")
    const [nameErrors, setNameErrors] = useState("")
    const [dobErrors, setDobErrors] = useState({
        day: "",
        month: "",
        year: "",
        all: ""
    })
    const [passwordType, setPasswordType] = useState("password")
    const [showOrHide, setShowOrHide] = useState("show")
    const [passwordFocus, setPasswordFocus] = useState(false)
    const [register] = useMutation(REGISTER_USER);
    const [login] = useMutation(LOGIN_USER);
    const { data, loading } = useQuery(MY_ACCOUNT)
    
    
    useEffect(() => {
        // Checking if user is authenticated and that theyre not logging in 
        // To see whether to push user off the route
        if(loggingIn === false && !loading && data && data.me) {
            history.push("/feed");
        }
    }, [loggingIn, loading, data, history])

    const onEmailChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name] : e.target.value})
        // Email validation : If email doesn't include a @ then set email errors
        const emailSign: any = /@/g;
        if(!e.target.value.match(emailSign)) {
            setEmailError("Email must include @")
        } else {
            setEmailError("")
        }
    }

    const onChange = (e:any) => {
        setFormData({...formData, [e.target.name] : e.target.value});
        const value = e.target.value;
        // Password validation 
        if(e.target.name === "password") {
            const lowerCaseLetters: any = /[a-z]/g;
            const upperCaseLetters: any = /[A-Z]/g;
            const numbers: any  = /[0-9]/g;
            // Does password contain a lowercase letter
            if(!value.match(lowerCaseLetters)) {  
                setPasswordErrors("Password must contain a lower case letter");
            }
            // Does password contain an uppercase letter
            if(!value.match(upperCaseLetters)) {  
                setPasswordErrors("Password must contain an Upper case letter");
            }
            // Does password contain a number
            if(!value.match(numbers)) {  
                setPasswordErrors("Password must contain a number");
            }
            // Does password contain 8 or more characters
            if(value.length < 8) {
                setPasswordErrors("Password must contain 8 or more characters");
            }
            // If passed valdiation set errors to empty
            if(value.match(lowerCaseLetters) && value.match(upperCaseLetters) && value.match(numbers) && value.length >= 8) {
                setPasswordErrors("");
            }
        }
        let number;
        // Validating the day of birth and parsing as integar
        if(e.target.name === "day") {
            number = parseInt(value);  
            // Check if number is between 1 and 31
            if(number < 1 || number > 31 ) {
                setDobErrors({...dobErrors, day: "Enter a correct day"})
            } else {
                setDobErrors({...dobErrors, day: ""})
            }
        }
        // Validating the year of birth and parsing as integar
        if(e.target.name === "year") {
            number = parseInt(value);
            // Getting current year
            var d = new Date();
            var year = d.getFullYear();
            // Check if number entered is above 1900 and under the current year
            if(number < 1900 || number > year ) {
                setDobErrors({...dobErrors, year: "Enter a correct year"})
            } else {
                setDobErrors({...dobErrors, year: ""})
            }
        }
    }

    const onSubmit =   (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Set logginIn state to true so the useEffect doesn't push us to /feed prematurely 
        setLogging(true);
        const { email , password, firstName , lastName, day, month , year} = formData;
        // Formatting the date of birth
        let dob = "";
        if(day !== "" &&  month !== "" && year !== "" ) {
            dob = day + " " + month + " " + year
        }
        // If fields aren't empty and their are no errors then register user
        if(emailError === "" && email !== "" && password !== "" && firstName !== "" && lastName !== "" && dob !== "" ) {
            register({
                variables: {
                    email: email.toLowerCase(),
                    password,
                    firstName: firstName.toLowerCase(),
                    lastName: lastName.toLowerCase(),
                    dob
                }
            })
            .then(async (res: any) => {
                // If our response contains any errors then we handle them by setting the correct error state
                if(res.data.register.email !== "" ) {
                    setEmailError(res.data.register.email);
                } else {
                    setEmailError("");
                }
                if(res.data.register.password !== "" ) {
                    setPasswordErrors(res.data.register.password);
                } else {
                    setPasswordErrors("");
                }
                // If repsonse is a success : log in the user and update MY_ACCOUNT cache
                if(res.data.register.success === true)  {
                    const response = await login({
                        variables: {
                            email: email.toLowerCase(),
                            password,
                        },
                        update: (cache, { data: { login } } )=> {
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
                        // If we have response data 
                        if (response?.data) {
                        // Set access token to the header
                        setAccessToken(response.data.login.accessToken)   
                        // Push to feed 
                        history.push("/feed")
                        // Set logging back to false
                        setLogging(false)
                        }
                    } catch(err) {
                        console.log(err.message);
                    }
                }
            })
            . catch(err => {
                console.log(err);
            })
        } else{
            // Else if there are empty fields and errors handle correctly by setting the correct state
            if(email === "") {
                setEmailError("You must enter a valid email address.");
            } else if(emailError !== "")  {
                setEmailError("You must enter a valid email address.");
            } else {
                setEmailError("");
            }
            if(password === ""){
                setPasswordErrors("You must enter a password.")
            } else {
                setPasswordErrors("")
            }
            if(firstName === ""){
                setNameErrors("You must enter a name.")
            } else {
                setNameErrors("")
            }
            if(day === "" || month === "" || year === ""){
                setDobErrors({...dobErrors , all : "You must enter a valid date of birth."})
            }else {
                setDobErrors({...dobErrors , all : ""})
            }
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
        <Fragment>
            <div className="login-container">
                <h1>SocialSongs</h1>
                <h2>Sign up to start creating projects and sharing with your mates</h2>
                <form onSubmit={(e) => onSubmit(e)}>
                    <span>
                        <label htmlFor="email">What's your email address?</label>
                        <input 
                            type="text" 
                            name="email" 
                            id="email"
                            value={formData.email} 
                            placeholder="Enter Email"
                            style={ emailError ? {border: "2px solid #F84061"} : {border: "none"} }
                            onChange={e => onEmailChange(e)}/>
                             { emailError && <p className="input-error">{emailError}</p>}
                    </span>
                    <span>
                        <label htmlFor="password">Password</label>
                        <input 
                            type={passwordType} 
                            name="password" 
                            id='password'
                            value={formData.password} 
                            placeholder="Enter Password"
                            style={ passwordErrors ? {border: "2px solid #F84061"} : {border: "none"} }
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(true)}
                            onChange={e => onChange(e)}/>
                             { passwordErrors && <p className="input-error">{passwordErrors}</p>}
                             <button id="show-password" onClick={(e) => showPassword(e)}>
                                <img src={`/assets/icons/validate/${showOrHide}-password.svg`} alt="Show/hide password"/>
                            </button>
                            <div className="password-warning" style={passwordFocus === true ?{display: "block"} : {display: "none"}}>
                                <p>Be cautious of the password you use, at this moment in time this is only a beta version of the application to demonstrate my development skills.</p>
                            </div>
                    </span> 
                    <span>
                    <p className="label-p">Have you got a name?</p>
                        <span className="name-wrapper">
                            <span className="name-inputs">
                                <label htmlFor="firstName">First Name</label>
                                <input 
                                    type="text" 
                                    name="firstName" 
                                    id="firstName"
                                    value={formData.firstName} 
                                    placeholder="First name"
                                    style={ nameErrors ? {border: "2px solid #F84061"} : {border: "none"} }
                                    onChange={e => onChange(e)}/>
                            </span>
                            <span className="name-inputs lastName-wrapper">
                                <label htmlFor="lastName">Last Name</label>
                                <input 
                                    type="text" 
                                    name="lastName" 
                                    id="lastName"
                                    value={formData.lastName} 
                                    placeholder="Last name"
                                    style={ nameErrors ? {border: "2px solid #F84061"} : {border: "none"} }
                                    onChange={e => onChange(e)}/>
                            </span>
                        </span>
                        { nameErrors && <p className="input-error">{nameErrors}</p>}
                    </span>
                    <span>
                        <p className="label-p">What's your date of birth?</p>
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
                                    style={  dobErrors.all || dobErrors.day !== "" ? {border: "2px solid #F84061"} : {border: "none"} }
                                    onChange={e => onChange(e)}/>
                            </span>
                            <span className="dob-inputs month-wrapper">
                                <label htmlFor="month">Month</label>
                                <select 
                                    name="month" 
                                    id="month" 
                                    required
                                    aria-invalid="true"
                                    style={  dobErrors.all || dobErrors.month !== "" ? {border: "2px solid #F84061"} : {border: "none"} }
                                    onChange={e => onChange(e)} defaultValue={""}>
                                    <option disabled value=""> Month</option>
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
                                    style={ dobErrors.all || dobErrors.year !== "" ? {border: "2px solid #F84061"} : {border: "none"} }
                                    onChange={e => onChange(e)}/>
                            </span>
                        </span>
                        { dobErrors.day || dobErrors.month || dobErrors.year || dobErrors.all ? <p className="input-error">Enter a valid date of birth</p> : null}
                    </span>
                    <input type="submit" value="Register" className="submit-btn" id="register-submit"/>
                    <p className="login-p">Already have an account? <Link to="/login" className="login-link">Login</Link></p>
                </form>
            </div>
         </Fragment>
    );
}

export default withRouter(Register);