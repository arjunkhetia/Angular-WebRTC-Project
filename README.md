# Angular WebRTC Project   ![Version][version-image]

![Linux Build][linuxbuild-image]
![Windows Build][windowsbuild-image]
![NSP Status][nspstatus-image]
![Test Coverage][coverage-image]
![Dependency Status][dependency-image]
![devDependencies Status][devdependency-image]

The quickest way to get start with WebRTC using Angular - 8.2.11 & Socket.IO - 2.3.0, just clone the project:

```bash
$ git clone https://github.com/arjunkhetia/Angular-WebRTC-Project.git
```

Install dependencies:

```bash
$ npm install
```

Start the Angular app at `http://localhost:4200/`:

```bash
$ npm start
```

You can clone the Back-end for this project with WebRTC using Node.Js, Express & Socket.IO at :

```bash
$ git clone https://github.com/arjunkhetia/Node.Js-Express-WebRTC-Project.git
```

Install dependencies:

```bash
$ npm install
```

Start Express.js app at `http://localhost:3000/`:

```bash
$ npm start
```

Angular project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.11.

# WebRTC

WebRTC stands for Web Real Time Communication, it is a free, open project that provides browsers and mobile applications with Real-Time Communications (RTC) capabilities via simple APIs. The WebRTC components have been optimized to best serve this purpose. We can use it to stream audio, stream video, share files, video chat, create a peer-to-peer data sharing service, create multiplayer games and more.

### MediaStream

The first step is to have the data that the user want to share. In this case, the stream that user want (audio/video), the mode of communication to establish is captured. Local media stream grants the browser to have access to stream devices such as the camera, web microphone. It also allows the browser to capture media.

### RTCPeerConnection

Once the user has decided stream of communication then the next step is to connect it with the partner’s system. It allows your browser to exchange data directly with partner browsers (peers) for voice and video calls. It allows the association between the sender and the receiver through STUN and TURN servers.

### RTCDataChannel

It grants the browsers to exchange arbitrary data bidirectional peer-to-peer.

### WebRTC Architecture
![1](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/1.png "1")

### WebRTC Signalling System
![2](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/2.png "2")

# Socket.IO

Socket.IO enables real-time bidirectional event-based communication.

```ts
import * as io from 'socket.io-client';

public socket: any;

constructor() {
  this.socket = io('http://localhost:3000', {
    reconnectionDelay: 1000,
    reconnection: true,
    reconnectionAttempts: 1,
    transports: ['websocket'], // default is ['polling', 'websocket']
    rejectUnauthorized: false
  });
  this.onInit();
}

public onInit() {
  this.socket.on('connect', () => {
    console.log('Connected to Server');
  });
  this.socket.on('connect_timeout', (timeout: any) => {
    console.log('Connection Timeout with : ', timeout);
  });
  this.socket.on('connect_error', (error: any) => {
    console.log('Connection Error : ', error);
  });
  this.socket.on('disconnect', (reason: any) => {
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually by socket.connect()
      console.log('The disconnection was initiated by the server, server disconnected');
    } else {
      // else the socket will automatically try to reconnect
      console.log('Server Disconnected : ', reason);
    }
  });
  this.socket.on('reconnect', (attemptNumber: any) => {
    console.log('Socket Server Successfully Reconnected with attempt : ', attemptNumber);
  });
  this.socket.on('reconnect_attempt', (attemptNumber: any) => {
    console.log('Reconnect Attempt : ', attemptNumber);
  });
  this.socket.on('reconnecting', (attemptNumber: any) => {
    console.log('Attempting to Reconnect : ', attemptNumber);
  });
  this.socket.on('reconnect_error', (error: any) => {
    console.log('Reconnection Error : ', error);
  });
  this.socket.on('reconnect_failed', () => {
    console.log('Reconnection Failed');
  });
  this.socket.on('ping', () => {
    console.log('ping packet is written out to the server');
  });
  this.socket.on('pong', (latency: any) => {
    console.log('pong is received from the server in : ', latency);
  });
}

public sendMessage(message: any) {
  this.socket.emit('client-message', message);
}

public getMessage = () => {
  return Observable.create((observer: any) => {
    this.socket.on('server-message', (message: any) => {
      observer.next(message);
    });
  });
}
```

### Project Screen
![project](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/project.png "project")

# Text Mode -

### Sender
![text-1](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/text-1.png "text-1")

### Receiver
![text-2](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/text-2.png "text-2")

# File Mode -

### Sender
![file-1](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/file-1.png "file-1")

### Receiver
![file-2](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/file-2.png "file-2")

# Audio Mode -

### Sender
![audio-1](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/audio-1.png "audio-1")

### Receiver
![audio-2](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/audio-2.png "audio-2")

# Video Mode -

### Sender
![video-1](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/video-1.png "video-1")

### Receiver
![video-2](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/video-2.png "video-2")

# Screen Sharing Mode -

### Sender
![screen-1](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/screen-1.png "screen-1")

### Receiver
![screen-2](https://github.com/arjunkhetia/Angular-WebRTC-Project/blob/master/src/assets/screen-2.png "screen-2")

[version-image]: https://img.shields.io/badge/Version-1.0.0-orange.svg
[linuxbuild-image]: https://img.shields.io/badge/Linux-passing-brightgreen.svg
[windowsbuild-image]: https://img.shields.io/badge/Windows-passing-brightgreen.svg
[nspstatus-image]: https://img.shields.io/badge/nsp-no_known_vulns-blue.svg
[coverage-image]: https://img.shields.io/coveralls/expressjs/express/master.svg
[dependency-image]: https://img.shields.io/badge/dependencies-up_to_date-brightgreen.svg
[devdependency-image]: https://img.shields.io/badge/devdependencies-up_to_date-yellow.svg
