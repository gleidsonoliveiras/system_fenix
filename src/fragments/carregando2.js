import React, { Component } from 'react';
import load from './../assets/logiad.json';
import Lottie from 'react-lottie';

// import { Container } from './styles';

export default class Carregando extends Component {
  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: load,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return (
      <div style={{ marginTop: '45%', backgroundColor: '#fff' }}>
        <div style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Lottie
            options={defaultOptions}
            height={200}
            width={200}
            isStopped={false}
              isPaused={false}
            style={{width: 150, height: 150}}
          />
        </div>
        <div style={{ justifyContent: 'center', alignItems: 'center' }}>
          <p style={{
            marginTop: 25,
            textAlign: 'center',
            fontSize: 18,
            height: 50,
            color: "#8f8e8e",
            fontWeight: "bold",

            width: '100%'
          }}
          >
            Carregando...
                </p>
        </div>
      </div>
    );
  }
}
