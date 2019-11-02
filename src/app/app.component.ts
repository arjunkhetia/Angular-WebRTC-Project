import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketserviceService } from './service/socketservice.service';
import { Subscription } from 'rxjs';
import adapter from 'webrtc-adapter';
import { saveAs } from 'file-saver';

declare global {
  interface Window {
    RTCPeerConnection: RTCPeerConnection;
    mozRTCPeerConnection: RTCPeerConnection;
    webkitRTCPeerConnection: RTCPeerConnection;
    RTCSessionDescription: RTCSessionDescription;
    mozRTCSessionDescription: RTCSessionDescription;
    webkitRTCSessionDescription: RTCSessionDescription;
    RTCIceCandidate: RTCIceCandidate;
    mozRTCIceCandidate: RTCIceCandidate;
    webkitRTCIceCandidate: RTCIceCandidate;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public browser = <any>navigator;
  public title: string = 'Angular WebRTC Project';
  public introline: string = '(Web Real-Time Communication using Socket.IO)';
  public subscription: Subscription;
  public serverStatus: boolean;
  public clientId: any = '';
  public socketId: any = '';
  public clients: any = [];
  public textEnable: boolean = true;
  public fileEnable: boolean = false;
  public audioEnable: boolean = false;
  public videoEnable: boolean = false;
  public screenEnable: boolean = false;
  public connected: boolean = false;
  public fromClientId: any;
  public toClientId: any;
  public peerConnection: any;
  public dataChannel: any;
  public offer: any;
  public message: any;
  public messages: string[] = [];
  public audio: any;
  public remoteAudio: any;
  public audioStream: any;
  public audioTrack: AudioTrack;
  public videoTrack: VideoTrack;
  public video: any;
  public remoteVideo: any;
  public videoStream: any;
  public videoWidth: number = 400;
  public videoHeight: number = 300;
  public screen: any;
  public remoteScreen: any;
  public screenStream: any;
  public screenWidth: number = 400;
  public screenHeight: number = 300;
  public file: File;
  public fileReader: FileReader;
  public sendFileName: any = 'Choose file';
  public sendProgressMin: number = 0;
  public sendProgressMax: number = 0;
  public sendProgressValue: any = 0;
  public receivedFileName: any;
  public receivedFileSize: any;
  public receivedFileType: any;
  public receivedProgressMin: number = 0;
  public receivedProgressMax: number = 0;
  public receivedProgressValue: any = 0;
  public receiveBuffer = [];
  public receivedBlob: Blob;
  public enableDownload: boolean = false;

  @ViewChild('audioElement', {static: false}) audioElement: ElementRef;
  @ViewChild('remoteAudioElement', {static: false}) remoteAudioElement: ElementRef;
  @ViewChild('videoElement', {static: false}) videoElement: ElementRef;
  @ViewChild('remoteVideoElement', {static: false}) remoteVideoElement: ElementRef;
  @ViewChild('screenElement', {static: false}) screenElement: ElementRef;
  @ViewChild('remoteScreenElement', {static: false}) remoteScreenElement: ElementRef;

  constructor(public socketservice: SocketserviceService) { }

  ngOnInit(): void {
    console.log('Adapter : ', adapter);
    if (this.socketservice) {
      this.subscription = this.socketservice.getSocketId().subscribe((message: any) => {
        this.serverStatus = true;
        this.clientId = message.clientId;
        this.fromClientId = message.clientId;
        this.socketId = message.socketId;
        this.subscription.unsubscribe();
      });
      this.socketservice.getClients().subscribe((clients: any) => {
        this.clients = clients;
      });
      window.RTCPeerConnection = this.getRTCPeerConnection();
      window.RTCSessionDescription = this.getRTCSessionDescription();
      window.RTCIceCandidate = this.getRTCIceCandidate();
      this.browser.getUserMedia = this.getAllUserMedia();
      this.peerConnection = new RTCPeerConnection({
        "iceServers": [
          // {
          //   "urls": "stun:stun.l.google.com:19302"
          // },
          // {
          //   "urls": "turn:192.158.29.39:3478?transport=udp",
          //   "credential": "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          //   "username": "28224511:1379330808"
          // },
          // {
          //   "urls": "turn:192.158.29.39:3478?transport=tcp",
          //   "credential": "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          //   "username": "28224511:1379330808"
          // }
        ]
      });
      console.log('RTCPeerConnection : ', this.peerConnection);
      this.peerConnection.onicecandidate = (candidate: RTCIceCandidate) => {
        console.log('ICE Candidate : ', candidate);
        this.socketservice.sendIceCandidate({
          from : this.fromClientId,
          to : this.toClientId,
          type : candidate.type,
          candidate : candidate.candidate
        });
      };
      this.peerConnection.oniceconnectionstatechange = (connection: RTCIceConnectionState) => {
        console.log('ICE Connection : ', connection);
        console.log('ICE Connection State : ', this.peerConnection.iceConnectionState);
      };
      this.peerConnection.ondatachannel = (event: any) => {
        console.log("Data Channel Attached");
        const onChannelReady = () => {
          this.dataChannel = event.channel;
        };
        if (event.channel.readyState !== 'open') {
          event.channel.onopen = onChannelReady;
        } else {
          onChannelReady();
        }
      };
      this.peerConnection.ontrack = (event: any) => {
        if (this.audioEnable) {
          this.remoteAudio = this.remoteAudioElement.nativeElement;
          console.log('Audio Track Received');
          try {
            this.remoteAudio.srcObject = event.streams[0];
          } catch(err) {
            this.remoteAudio.src = window.URL.createObjectURL(event.streams[0]);
          }
          setTimeout(() => {
            this.remoteAudio.play();
          }, 500);
        } else if (this.videoEnable) {
          this.remoteVideo = this.remoteVideoElement.nativeElement;
          console.log('Video Track Received');
          try {
            this.remoteVideo.srcObject = event.streams[0];
          } catch(err) {
            this.remoteVideo.src = window.URL.createObjectURL(event.streams[0]);
          }
          setTimeout(() => {
            this.remoteVideo.play();
          }, 500);
        } else if (this.screenEnable) {
          this.remoteScreen = this.remoteScreenElement.nativeElement;
          console.log('Screen Track Received');
          try {
            this.remoteScreen.srcObject = event.streams[0];
          } catch(err) {
            this.remoteScreen.src = window.URL.createObjectURL(event.streams[0]);
          }
          setTimeout(() => {
            this.remoteScreen.play();
          }, 500);
        }
      };
      this.socketservice.receiveOffer().subscribe(async (offer: RTCSessionDescription) => {
        console.log('Offer Received : ', offer);
        await this.peerConnection.setRemoteDescription({type: 'offer', sdp: offer.sdp});
        this.toClientId = offer['from'];
        this.peerConnection.createAnswer().then(async (answer: RTCSessionDescription) => {
          console.log('Answer Created : ', answer);
          await this.peerConnection.setLocalDescription(answer);
          this.socketservice.sendAnswer({
            from : this.fromClientId,
            to : this.toClientId,
            type : answer.type,
            sdp : answer.sdp
          });
        });
      });
      this.socketservice.receiveAnswer().subscribe(async (answer: RTCSessionDescription) => {
        console.log('Answer Received : ', answer);
        await this.peerConnection.setRemoteDescription({type: 'answer', sdp: answer.sdp});
      });
      this.socketservice.receiveIceCandidate().subscribe((candidate: RTCIceCandidate) => {
        if (candidate.candidate) {
          console.log('ICE Candidate Received : ', candidate);
          // this.peerConnection.addIceCandidate(candidate.candidate);
        }
      });
      this.socketservice.receiveFile().subscribe(async (file: any) => {
        console.log('File Received : ', file);
        if (file['type'] == 'file') {
          this.receivedFileName = file['fileName'];
          this.receivedFileSize = file['fileSize'] + ' bytes';
          this.receivedFileType = file['fileType'];
          this.receivedProgressValue = 0;
        } else if (file['type'] == 'file-status') {
          this.receivedProgressValue = file['progressValue'];
        } else if (file['type'] == 'file-complete') {
          this.receivedBlob = new Blob(this.receiveBuffer, { type: this.receivedFileType });
          this.enableDownload = true;
        }
      });
    } else {
      this.serverStatus = false;
    }
  }

  public getRTCPeerConnection() {
    return window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;
  }

  public getRTCSessionDescription() {
    return window.RTCSessionDescription ||
      window.mozRTCSessionDescription ||
      window.webkitRTCSessionDescription;
  }

  public getRTCIceCandidate() {
    return window.RTCIceCandidate ||
      window.mozRTCIceCandidate ||
      window.webkitRTCIceCandidate;
  }

  public getAllUserMedia() {
    return this.browser.getUserMedia ||
      this.browser.webkitGetUserMedia ||
      this.browser.mozGetUserMedia ||
      this.browser.msGetUserMedia;
  }

  public getAllUserMediaScreen() {
    if (this.browser.getDisplayMedia) {
      return this.browser.getDisplayMedia({video: true});
    } else if (this.browser.mediaDevices.getDisplayMedia) {
      return this.browser.mediaDevices.getDisplayMedia({video: true});
    } else {
      return this.browser.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}});
    }
  }

  public enableText() {
    try {
      this.stopAudio();
    } catch(e) { }
    try {
      this.stopVideo();
    } catch(e) { }
    try {
      this.stopScreen();
    } catch(e) { }
    this.textEnable = true;
    this.fileEnable = false;
    this.audioEnable = false;
    this.videoEnable = false;
    this.screenEnable = false;
  }

  public enableFile() {
    try {
      this.stopAudio();
    } catch(e) { }
    try {
      this.stopVideo();
    } catch(e) { }
    try {
      this.stopScreen();
    } catch(e) { }
    this.textEnable = false;
    this.fileEnable = true;
    this.audioEnable = false;
    this.videoEnable = false;
    this.screenEnable = false;
  }

  public handleFileInput(files: FileList) {
    if (files[0]) {
      this.file = files[0];
      this.sendFileName = this.file['name'];
      console.log(this.file);
      this.sendProgressMin = 0;
      this.sendProgressMax = this.file.size;
    } else {
      this.sendFileName = 'Choose file';
    }
  }

  public sendFile() {
    let oldSendProgressValue = 0;
    this.socketservice.sendFile({
      from : this.fromClientId,
      to : this.toClientId,
      type: 'file',
      fileName : this.file['name'],
      fileSize : this.file['size'],
      fileType: this.file['type']
    });
    const chunkSize = 16384;
    let offset = 0;
    this.fileReader = new FileReader();
    this.fileReader.onload = (event: any) => {
      this.dataChannel.send(event.target.result);
      offset += event.target.result.byteLength;
      this.sendProgressValue = ((offset*100)/this.sendProgressMax).toFixed(1);
      if (this.sendProgressValue !== oldSendProgressValue) {
        this.socketservice.sendFile({
          from : this.fromClientId,
          to : this.toClientId,
          type: 'file-status',
          progressValue : this.sendProgressValue
        });
        oldSendProgressValue = this.sendProgressValue;
      }
      if (offset < this.file.size) {
        this.readSlice(offset, chunkSize);
      }
      if (this.sendProgressValue == 100.0) {
        this.socketservice.sendFile({
          from : this.fromClientId,
          to : this.toClientId,
          type: 'file-complete'
        });
      }
    }
    this.readSlice(offset, chunkSize);
  }

  public readSlice(offset: any, chunkSize: any) {
    const slice = this.file.slice(offset, offset + chunkSize);
    this.fileReader.readAsArrayBuffer(slice);
  }

  public downloadFile() {
    saveAs(this.receivedBlob, this.receivedFileName);
  }

  public enableAudio() {
    try {
      this.stopVideo();
    } catch(e) { }
    try {
      this.stopScreen();
    } catch(e) { }
    this.textEnable = false;
    this.fileEnable = false;
    this.audioEnable = true;
    this.videoEnable = false;
    this.screenEnable = false;
    setTimeout(() => {
      this.audio = this.audioElement.nativeElement;
      let constraints = { audio: true };
      this.browser.mediaDevices.getUserMedia(constraints).then((stream: any) => {
        if(!stream.stop && stream.getTracks) {
          stream.stop = function(){
            this.getTracks().forEach(function (track: any) {
              track.stop();
            });
          };
        }
        this.audioStream = stream;
        this.audioTrack = stream.getAudioTracks();
        if (this.audioTrack) {
          console.log('Using audio device: ' + this.audioTrack[0].label);
        }
        try {
          this.audio.srcObject = this.audioStream;
        } catch(err) {
          this.audio.src = window.URL.createObjectURL(this.audioStream);
        }
        stream.getTracks().forEach((track: any) => {
          this.peerConnection.addTrack(track, stream);
        });
        setTimeout(() => {
          this.audio.play();
        }, 500);
      });
    }, 1000);
  }

  public enableVideo() {
    try {
      this.stopAudio();
    } catch(e) { }
    try {
      this.stopScreen();
    } catch(e) { }
    this.textEnable = false;
    this.fileEnable = false;
    this.audioEnable = false;
    this.videoEnable = true;
    this.screenEnable = false;
    setTimeout(() => {
      this.video = this.videoElement.nativeElement;
      let constraints = { audio: true, video: { minFrameRate: 60, width: 400, height: 300 } };
      this.browser.mediaDevices.getUserMedia(constraints).then((stream: any) => {
        if(!stream.stop && stream.getTracks) {
          stream.stop = function(){
            this.getTracks().forEach(function (track: any) {
              track.stop();
            });
          };
        }
        this.videoStream = stream;
        this.videoTrack = stream.getVideoTracks();
        this.audioTrack = stream.getAudioTracks();
        if (this.videoTrack) {
          console.log('Using video device: ' + this.videoTrack[0].label);
        }
        if (this.audioTrack) {
          console.log('Using audio device: ' + this.audioTrack[0].label);
        }
        try {
          this.video.srcObject = this.videoStream;
        } catch(err) {
          this.video.src = window.URL.createObjectURL(this.videoStream);
        }
        stream.getTracks().forEach((track: any) => {
          this.peerConnection.addTrack(track, stream);
        });
        setTimeout(() => {
          this.video.play();
        }, 500);
      });
    }, 1000);
  }

  public enableScreen() {
    try {
      this.stopAudio();
    } catch(e) { }
    try {
      this.stopVideo();
    } catch(e) { }
    this.textEnable = false;
    this.fileEnable = false;
    this.audioEnable = false;
    this.videoEnable = false;
    this.screenEnable = true;
    setTimeout(() => {
      this.screen = this.screenElement.nativeElement;
      this.getAllUserMediaScreen().then((stream: any) => {
        if(!stream.stop && stream.getTracks) {
          stream.stop = function(){
            this.getTracks().forEach(function (track: any) {
              track.stop();
            });
          };
        }
        this.screenStream = stream;
        this.videoTrack = stream.getVideoTracks();
        if (this.videoTrack) {
          console.log('Using video device: ' + this.videoTrack[0].label);
        }
        try {
          this.screen.srcObject = this.screenStream;
        } catch(err) {
          this.screen.src = window.URL.createObjectURL(this.screenStream);
        }
        stream.getTracks().forEach((track: any) => {
          this.peerConnection.addTrack(track, stream);
        });
        setTimeout(() => {
          this.screen.play();
        }, 500);
      });
    }, 1000);
  }

  public stopAudio() {
    this.audioStream.stop();
  }

  public stopVideo() {
    this.videoStream.stop();
  }

  public stopScreen() {
    this.screenStream.stop();
  }

  public async connect() {
    this.connected = true;
    this.dataChannel = await this.peerConnection.createDataChannel('datachannel');
    if (this.fileEnable) {
      this.dataChannel.binaryType = 'arraybuffer';
    }
    this.dataChannel.onerror = (error: any) => {
      console.log("Data Channel Error:", error);
    };
    this.dataChannel.onmessage = (event: any) => {
      if (this.textEnable) {
        console.log("Got Data Channel Message:", JSON.parse(event.data));
        this.messages.push(JSON.parse(event.data));
      } else if (this.fileEnable) {
        this.receiveBuffer.push(event.data);
      }
    };
    this.dataChannel.onopen = () => {
      console.log("Data Channel Opened");
    };
    this.dataChannel.onclose = () => {
      console.log("The Data Channel is Closed");
    };
    this.offer = this.peerConnection.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
      voiceActivityDetection: 1
    }).then(async (offer: RTCSessionDescription) => {
      console.log('Offer Created : ', offer);
      await this.peerConnection.setLocalDescription(offer);
      this.socketservice.sendOffer({
        from : this.fromClientId,
        to : this.toClientId,
        type : offer.type,
        sdp : offer.sdp
      });
    });
  }

  public sendMessage() {
    this.dataChannel.send(JSON.stringify({clientId: this.fromClientId, data: this.message}));
    this.messages.push(JSON.parse(JSON.stringify({clientId: this.fromClientId, data: this.message})));
    this.message = '';
  }

  public disconnect() {
    try {
      this.stopAudio();
    } catch(e) { }
    try {
      this.stopVideo();
    } catch(e) { }
    try {
      this.stopScreen();
    } catch(e) { }
    this.connected = false;
    this.toClientId = '';
    this.enableDownload = false;
    this.sendProgressValue = 0;
    this.receivedProgressValue = 0;
    this.sendFileName = '';
    this.receivedFileName = '';
    this.receivedFileSize = '';
    this.receivedFileType = '';
  }

}
