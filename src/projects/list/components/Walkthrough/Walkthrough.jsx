import React, { PropTypes } from 'react'
import './Walkthrough.scss'

const Walkthrough = ({currentUser}) => (
  <div className="walkthrough-column">
    
    <span className="text-img"/>
    
    <div className="bubble">
      <span className="robot"/>
      <span className="shadow"/>
      <div>
        <span className="arrow"/>
        <h3>010010010010100101001000100100101 <br/>Bzzt …I mean… Hello, {currentUser.firstName}!</h3>
        <p>Welcome to Connect! I’m Coder the Robot. I see you have no projects yet. To get you started, press the “New Project” and let’s build something.</p>
      </div>
    </div>
  </div>
)

Walkthrough.PropTypes = {
  currentUser: PropTypes.object.isRequired
}

export default Walkthrough
