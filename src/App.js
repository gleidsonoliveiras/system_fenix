import React, { Component } from 'react';
import Routes from './routes';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
          <Routes/>
      </div>
    );
  }
}