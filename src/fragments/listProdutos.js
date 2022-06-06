import React, { Component } from 'react';
import VariaveisGlobais from './../utilites/variaveisDoSistema';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

// import { Container } from './styles';

export default class ListProdutos extends Component {
  render() {
    const vglobais = new VariaveisGlobais();
    console.log("Imagem: ", vglobais.getHostIMG + '/pod/' + this.props.Imagem)
    return (
      <ListItem alignItems="flex-start" style={{ marginLeft: -2, marginRight: 10 }} onClick={() => {
        this.props.acao()
      }}>
        <ListItemAvatar>
          <div
            style={{ width: 50, height: 50, backgroundColor: "#BDBDBD", marginTop: -5 }}
          >
            <img
              cclassName="d-block w-100"
              src={vglobais.getHostIMG + '/pod/' + this.props.Imagem}
              alt="First slide"
              style={{ width: 50, height: 50, }}
            />
          </div>
          {/* <Avatar alt="Jarder Silva" src={{ uri: vglobais.getHostIMG + '/pod/' + this.props.Imagem }} /> */}
        </ListItemAvatar>
        {/* <Image
          source={{ uri: vglobais.getHostIMG + '/pod/' + this.props.Imagem }}
          indicator={Progress}
          indicatorProps={{
            size: 35,
            borderWidth: 0,
            color: 'rgba(150, 150, 150, 1)',
            unfilledColor: 'rgba(200, 200, 200, 0.2)'
          }}
          style={{
            marginTop: 0,
            width: 60,
            height: 60,
            backgroundColor: '#d8dadc',
            position: 'relative',
          }}>
        </Image> */}
        <div style={{ width: '100%' }}>
          <div tyle={{ width: '100%' }}>
            <label style={{ fontWeight: 'bold', }} maxlength="3">{this.props.Nome}</label>
          </div>
          <div tyle={{ width: '100%', maxHeight: "1em" }}>
            {this.props.Obs}
          </div>
          <div tyle={{ width: '100%' }}>
            <label style={{ fontSize: 15, fontWeight: 'bold', width: '100%' }}>R$ {this.mascaraValor(eval(parseFloat(this.props.Preco)).toFixed(2))}</label>
          </div>
        </div>
      </ListItem >
    );
  }

  mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return valor
  }


}
