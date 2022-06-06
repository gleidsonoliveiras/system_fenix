import React, { Component } from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';

export default class ListEnderecos extends Component {

  render() {
    return (
      <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
        <div style={{ width: '80%' }}>
          <a style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} onClick={this.props.Press}>
            <div>
              <div style={{ width: '100%' }}>
                <label style={{ width: '100%', }}>{this.props.Nome}</label>
              </div>
              <div style={{ width: '100%' }}>
                <label style={{ width: '100%', marginTop: 5, fontSize: 14 }}>{this.props.Endereco}</label>
              </div>
            </div>
          </a>
        </div>
        <div>
          <a style={{ marginRight: 5 }} onClick={this.props.Press}>
            {this.props.idDefault ? <CheckCircleOutlineIcon style={{ fontSize: 13, color: 'green' }} /> :
              null}
          </a>
          <a onClick={this.props.Excluir}>
            <DeleteIcon style={{ marginTop: 10, marginRight: -5, fontSize: 22, color: 'red' }} />
          </a>
        </div>
      </div>
    );
  }
}