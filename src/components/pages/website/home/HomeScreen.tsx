import React, { useEffect, useState } from 'react'
import './HomeScreen.scss';
import { browserName, browserVersion, deviceType, osName } from 'react-device-detect';
import { useLocation } from 'react-router-dom';
function HomeScreen() {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const scanMethod = queryParams.get('method'); // getting the scan method
  const [hasSendScan, setHasSendScan] = useState(false);

  useEffect(() => {
    if (!hasSendScan) {
          if (scanMethod) {
              let payload = {
                  customerKey: "PPG-Website",
                  gameID: "",
                  browser: browserName,
                  browserVersion: browserVersion,
                  device: deviceType,
                  OS: osName,
                  method: scanMethod
              }
              //console.log("PAYLOAD", payload)
              fetch(`${
                  process.env.REACT_APP_API_URL 
              }/Game/SaveQRScan`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(payload)
              }).catch(err => {
                  console.log(err); 
              });
              setHasSendScan(true); 
          }
  }
  }, []);

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
      
      <p>Our innovative mobile application transforms your traditional scorecard into an interactive, personalized tool that does more than just keep track of your strokes.</p> 
      <p>With PuttPuttGo, you can analyze your game in-depth, uncover your best and worst holes, and share your achievements on the digital green.</p>
      
      <p>Enjoy a seamless, modern golf experience, whether you're at a miniature golf course or teeing off on a full 18-hole course. Step beyond the green with PuttPuttGo, and embrace a new golfing experience. </p>
      </div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen