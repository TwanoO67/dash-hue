# dash-hue
Use Amazon Dash Buttons to Control Hue Smart lights.

Turn off your lights, and send you an

## Installation

* ```npm install```
* ```cp config.js.sample config.js```
* Follow the setup instructions for Hue and Amazon Dash
* Find your hue bridge IP address and setup an account (see: http://www.developers.meethue.com/documentation/getting-started)
* Enter the IP Address and Username into "config.js"
* Run ```sudo node node_modules/node-dash-button/bin/findbutton``` and press your Dash button. At this point, you should be able to see the MAC address for you dash button.
* Copy the mac address into the script at the bottom
* Run ```npm start```
* Your done. Press you button, and watch your lights respond.
