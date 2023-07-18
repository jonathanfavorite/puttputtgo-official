import React from 'react'
import './HomeScreen.scss';
function HomeScreen() {
  return (
    <div id='home-screen'>
      <div id='hero' style={{
        backgroundImage: 'url(/website/background.jpg)'
      }}>
      <div id='header'>
        <div className='logo'>
          <img src='/global-assets/ppg-logo.svg' alt='PPG Logo'/>
        </div>
      </div>
      </div>
      

      <div id='content-wrapper'>
        <div className='content big-about'>
          <h1>Beyond the Green:<br />
A new golf experience</h1>
      <div className='desc'>
      <p>Welcome to PuttPuttGo, where we're redefining what it means to golf in the digital age.</p>
      
      <p>Our innovative mobile application transforms your traditional scorecard into an interactive, personalized tool that does more than just keep track of your strokes. With PuttPuttGo, you can analyze your game in-depth, uncover your best and worst holes, and share your achievements on the digital green.</p>
      
      <p>Enjoy a seamless, modern golf experience, whether you're at a miniature golf course or teeing off on a full 18-hole course. Step beyond the green with PuttPuttGo, and embrace a new golfing experience. </p>
      </div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen