import "./App.css";
import React, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import {drawhand} from "./utilities"

function App() {
  const webcamRef= useRef(null);
  const canvasRef= useRef(null);

  const runHandpose = async () =>{
    const net = await handpose.load(); //waiting to model to load (neural network)
    console.log("handpose loaded");
    //loop and detect hand
    //net is the neural network
    setInterval(()=>{  //set interval js function , runs loop , 100 every 100 ms
      detect(net);
    },100)
  };
  const detect = async ( net) =>{
        //check data if available
        if(typeof webcamRef.current !== "undefined" 
        && webcamRef.current !== null
        && webcamRef.current.video.readyState === 4
        ){
          //set the ht and width
          const video = webcamRef.current.video;
          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;

          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;

          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          //making detection
          const hand = await net.estimateHands(video);
          console.log(hand); //landmarks r here see

          //draw
          const ctx=canvasRef.current.getContext('2d');
          drawhand(hand, ctx);


        }
        
        //make detection and draw mesh
  }

  runHandpose();
  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position:"absolute",
            left:0,
            right:0,
            margin: "auto",
            textAlign: "center",
            zindex: 9,
            height: 800,
            width: 800,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position:"absolute",
            left:0,
            right:0,
            margin: "auto",
            textAlign: "center",
            zindex: 9,
            height: 800,
            width: 800,
          }}
        />
      </header>
    </div>
  );
}

export default App;
