import React, { Component } from 'react';
import VariaveisGlobais from './../utilites/variaveisDoSistema';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';


// import { Container } from './styles';

export default class ListCardapio extends Component {


  render() {

    if (this.props.padrao === '1') {
      return this.listUm()
    } else if (this.props.padrao === '2') {
      return this.listDois()
    } else {
      return this.listTres()
    }

  }

  listDois() {
    const vglobais = new VariaveisGlobais();
    return (
      <List style={{ width: '100%', }}>
        <ListItem alignItems="flex-start" onClick={this.props.acao()}>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={{ uri: vglobais.getHostIMG + '/gp/' + this.props.Imagem }} />
          </ListItemAvatar>
          <ListItemText
            primary="Brunch this weekend?"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  style={{ display: 'inline', }}
                  color="textPrimary"
                >
                  {this.props.Nome}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>
      // <ListItem avatar style={{ marginLeft: 0, marginRight: 15, }} onPress={() => {
      //   this.props.acao()
      // }}>
      //   <Left>
      //     <Thumbnail source={{ uri: vglobais.getHostIMG + '/gp/' + this.props.Imagem }} style={{ width: 40, height: 40, marginRight: 0 }} />
      //   </Left>
      //   <Body>
      //     <Text style={{ paddingTop: 10, }}>{this.props.Nome}</Text>
      //     <Text style={{ color: 'white' }}>.</Text>
      //   </Body>
      // </ListItem>
    );
  }

  listUm() {
    const vglobais = new VariaveisGlobais();
    const image = vglobais.getHostIMG + '/gp/' + this.props.Imagem ;
    return (
      <div style={{
        width: '48%', height: 165,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
        marginBottom: 10
      }}>
        <a onClick={() => {
          //alert('oi')
          this.props.acao()
        }}>

          <div style={{ height: 165, resizeMode: "cover", justifyContent: "center", backgroundImage: `url(${image})`, backgroundSize: "100%" }}>
            <div style={{
              width: '100%', height: 165, backgroundColor: "rgba(0, 0, 0, 0.40)",
              borderRadius: 0,
              borderWidth: 0,
              borderColor: '#fff',
              display: 'flex',
              alignItems: 'center',
            }}>
              <div style={{ 
                fontSize: 17, 
                width: '100%', 
                textAlign: 'center', 
                fontWeight: 'bold', 
                color: '#fff', }}>{this.props.Nome}</div>
            </div>

          </div>
        </a>
      </div>
    );
  }


  listTres() {
    const vglobais = new VariaveisGlobais();
    const image = { uri: vglobais.getHostIMG + '/gp/' + this.props.Imagem };
    return (
      <a style={{
        width: '100%', height: 165,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fff',
        marginBottom: 10
      }} onPress={() => {
        this.props.acao()
      }}>
        <div style={{ flex: 1, resizeMode: "cover", justifyContent: "center", backgroundImage: `url(${image})`, backgroundSize: "100%" }}>
          <div style={{
            width: '100%', flex: 1, backgroundColor: "rgba(0, 0, 0, 0.40)",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#fff',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20
          }}>
            <p style={{ fontSize: 17, width: '100%', textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>{this.props.Nome}</p>
          </div>
        </div>
      </a>
    );
  }

}
