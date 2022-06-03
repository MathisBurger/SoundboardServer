<div align="center">
    <h1>SoundboardServer</h1>
<hr>
<strong>A soundboard that can be controlled remotely via a web application.</strong>
    <br>
<img src="https://img.shields.io/github/license/mathisburger/SoundboardServer?style=for-the-badge" />
<img src="https://img.shields.io/github/last-commit/mathisburger/mathis-burger.de?style=for-the-badge" />
</div>
<hr>
<div align="center">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Go_Logo_Blue.svg/800px-Go_Logo_Blue.svg.png" width="300" />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/1200px-Nextjs-logo.svg.png" height="100" />    
</div>

# Project information

This project has been created for personal purposes. SoundboardServer
is an web application that plays sounds on the host. You can connect via the web interface
with multiple clients to the server and play sounds remotely. Furthermore, the live data is streamed 
via a websocket. Therefore, each client has the latest state of playing sounds

# Which data is live updated?

Data like new sounds is not live updated. The only data that is updated is the current playing
sound. All other data must be refreshed with a relogin into the web interface

# Software updates

This project will <strong>not</strong> recive any updates except updates I want to deliver.
So if there is any feature I want to become implemented I will do so, but no other features from the 
community will be added.

# Installation

Installing this project is quite easy, if you follow these steps:

1. Clone repository
```shell
    git clone https://github.com/MathisBurger/SoundboardServer.git
```

2. Build for your environment<br>
    You just need to execute the build script for your OS.<br>
    <strong>Windows:</strong> build.bat<br>
    <strong>Linux/MacOS:</strong> build.sh
