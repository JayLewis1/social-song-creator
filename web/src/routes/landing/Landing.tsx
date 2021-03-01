import React, { useState } from 'react'
import { Link } from "react-router-dom";

const Landing = () => {
  const [projectOption, setProjectOption] = useState("record");
  return (
    <div className="landing-container">
      <header>
        <div className="header-wrapper">
        <span className="logo">
          SocialSongs
        </span>
        <div className="header-links">
          <Link to="/login">Login</Link>
          <Link className="register-link"to="/register">Register</Link>
        </div>
        </div>
      </header>

  
      <div className='bg-container'>
        <div className="dark-bg"></div>
      <div className="intro-container">
        <div className="titles-container">
          <h1>Create,</h1><br />
          <h1>Collaborate and</h1><br />
          <h1>Share</h1><br />
          <h2>Record, write and tab out song ideas but don’t only do it alone, share them with mates and collaborate and create something together.</h2>
          <span className="link-span">
            <Link to="register">Sign up today</Link>
            <button>Find out more<img className="down-arrow" src="/assets/icons/landing/down-arrow.svg" alt="down arrow"></img></button>
          </span>
        </div>
        <div className="graphic-container">
          <img src="/assets/icons/landing/illustration.svg" alt="Illustration"/>
        </div>
      </div>

        <div className="how-to-get-started">
            <h3>How to get started?</h3>
            <div className="instructions-container"></div>
      </div>
      </div>

    <div className="project-showcasing">
      <h4>Create Projects</h4>
      <div className="flex-container">
      <div className="project-list">
        <ul>
          <li className={projectOption === "record" ? "selected" : ""}  onMouseOver={() => setProjectOption("record")}>
            <img src="/assets/icons/landing/record.svg" alt="Recording" id="record-icon"></img> 
            <span>
              <h5>Record</h5>
              <p>Record audio and store them as tracks which can name, delete and of course play to listen back to the audio.</p>
            </span>
          </li>
          <li className={projectOption === "lyrics" ? "selected" : ""} onMouseOver={() => setProjectOption("lyrics")}> 
          <img src="/assets/icons/landing/lyrics.svg" alt="Lyrics"></img> 
            <span>
              <h5>Write Lyrics</h5>
              <p>Write down lyrical ideas that you can edit, delete and keep them all in one place related to the project.</p>
            </span>
          </li>
          <li className={projectOption === "tab" ? "selected" : ""} onMouseOver={() => setProjectOption("tab")}>
          <img src="/assets/icons/landing/tab.svg" alt="Tab"></img> 
            <span>
              <h5>Tab Out</h5>
              <p>If your instrument is a guitar, keep track of your riffs, chord progression within the tab elements which are easy to read and keep track of.</p>
            </span>
          </li>
        </ul>
      </div>
      <div className="project-demo">
        <h6>Try for yourself</h6>
        <div className="record-container">
          <button>
            <img src="/assets/icons/workspace/record.svg" alt="Record"/>
          </button>
        </div>
        <ul>
          <li> 
            <span>
             <p className="track-name">Example Track</p>
             <p>Play me</p>
            </span>
            <span className="btn-container">
              <button>
              <img src="/assets/icons/post/play.svg" alt="Play"/>
              </button>
            </span>
          </li>
        </ul>
      </div>
      </div>
    </div>

  
    <div className="want-to-get-started">
    <div className="blue-bg"></div>
      <h3>Want to get started?</h3>
      <p>Start creating and sharing your projects today.</p>
      <Link to="/register">Sign up today</Link>
  </div>
    <div className="contact-container">
      <h6>Got something to say?</h6>
      <p>Contact me and I'll get back to you as soon as I can</p>
      <form>
        <span className="input-span">
            <label htmlFor="name">Your Name</label>
            <input type="text" id="firstName" placeholder="Enter your full name"/>
        </span>
        <span className="input-span">
          <label htmlFor="email">Email</label>
          <input type="text" id="email" placeholder="Enter your email"/>
        </span>
        <span className="input-span">
          <label htmlFor="message">Message</label>
          <textarea id="message" placeholder="Hi Jay awesome app? Have you thought about . . ."/>
        </span>
        <input type="submit" value="Send message"/>
      </form>
    </div>

    <div className="footer">
      <div className="dark-bg"></div>
    </div>

    </div>
  )
}

export default Landing