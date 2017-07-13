NOTE - The service being used for this project no longer exists so the code now won't work

This is the code for a project to get South Yorkshire bus times and display arival countdowns using a NeoPixel strip of LEDs.

https://twitter.com/timfenwick15/status/825367513747832832

The project consists of:
- A Nodejs server that makes a request to http://tsy.acislive.com/ and parses out upcoming bus arival times
- Adafruit NeoPixel Digital RGB LED Strip - https://www.adafruit.com/products/1460
- Adafruit Feather HUZZAH ESP8266 - https://learn.adafruit.com/adafruit-feather-huzzah-esp8266
- Arduino code to make requests to the server and control NeoPixel LEDs

To run, a Wifi name and password will need to be added to bus.ino.

A Sheffield bus service number and stop number are given as an example in requestbus.js. These details can be found at http://tsy.acislive.com/
