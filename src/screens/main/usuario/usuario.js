import React, { Component } from 'react';
import api from './../../../utilites/api';
import { setCar, getCar, setCarEmp, setCurrentTab, setPedidoA } from './../../../redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';


class Usuario extends Component {

  state = {
    user: [],
    nome: '',
    celular: '',
    idUser: '',
    endPadrao: '',
    auth_token: '',
    userNome: '',
    isLoading: false

  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    const { setCurrentTab } = this.props;

    if (localStorage.getItem('@webApp/userid') !== null) {
      this.setState({
        idUser: localStorage.getItem('@webApp/userid'),
        nome: localStorage.getItem('@webApp/username'),
        celular: localStorage.getItem('@webApp/usertelefone'),
        userNome: localStorage.getItem('@webApp/userid') + '-' + localStorage.getItem('@webApp/username'),
      });
      this.getServidor();
    } else {
      setCurrentTab(0);
    }

  }

  async getServidor() {

    try {
      const data = new FormData();
      data.append('Cliente', this.state.userNome);
      const response4 = await api.post('ws/getFidel.php', data);
      if (response4.status === 200) {
        if (response4.data !== '[]') {
          this.setState({
            fidel: response4.data.compras,
          });
        }

      } else {
        alert('Erro na comunicação com  servidor!', 'Atenção', false);
      }

    } catch (error) {
      console.log('eroo ', error)
      alert('Erro na comunicação com servidor!', 'Atenção', false);
    }

    this.setState({ isLoading: false });
  }

  form() {
    const { setCurrentTab } = this.props;
    return (
      <div>
        <div>
          <div style={{ marginTop: 15, marginLeft: 0, marginRight: 15, marginLeft: 20 }}>
            <div>
              <label style={{ fontSize: 23, fontWeight: "bold", }}>{this.state.nome}</label>
            </div>
            <label style={{ marginTop: 5, }}>{this.state.celular}</label>

            {/* <View style={{ marginLeft: 0, marginTop: 5, paddingRight: 5, }}>
              <View style={{ marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: "bold", }}>Cartão fidelidade ( {this.state.fidel} / 10)</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <Icon type='AntDesign' name={this.state.fidel >= 1 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 1 ? 'green' : '#D3D3D3' }} />
                <Icon type='AntDesign' name={this.state.fidel >= 2 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 2 ? 'green' : '#D3D3D3' }} />
                <Icon type='AntDesign' name={this.state.fidel >= 3 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 3 ? 'green' : '#D3D3D3' }} />
                <Icon type='AntDesign' name={this.state.fidel >= 4 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 4 ? 'green' : '#D3D3D3' }} />
                <Icon type='AntDesign' name={this.state.fidel >= 5 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 5 ? 'green' : '#D3D3D3' }} />
                <Icon type='AntDesign' name={this.state.fidel >= 6 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 6 ? 'green' : '#D3D3D3' }} />
                <Icon type='AntDesign' name={this.state.fidel >= 7 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 7 ? 'green' : '#D3D3D3' }} />
                <Icon type='AntDesign' name={this.state.fidel >= 8 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 8 ? 'green' : '#D3D3D3' }} />
                <Icon type='AntDesign' name={this.state.fidel >= 9 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 9 ? 'green' : '#D3D3D3' }} />
              </View>
            </View> */}

            <div style={{ width: '100%', borderWidth: 2, borderColor: '#e6e6e6', borderWidth: 1, marginTop: 25, marginBottom: 30, }}></div>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              style={{ marginLeft: -15 }}
            >
              <ListItem button onClick={() => {
                this.props.history.push({
                  pathname: '/Endereco',
                  state: {
                    quemChamou: 'Carrinho',
                  }
                })
              }}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Meus endereços" />
              </ListItem>
              <ListItem button onClick={() => {
                this.props.history.push({
                  pathname: '/Pedidos',
                  state: {
                    quemChamou: 'Carrinho',
                  }
                })
              }}>
                <ListItemIcon>
                  <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Meus pedidos" />
              </ListItem>
              <ListItem button onClick={() => {
                localStorage.removeItem('@webApp/userid');
                localStorage.removeItem('@webApp/username');
                this.props.history.push({
                  pathname: '/',
                  state: {
                    quemChamou: 'Carrinho',
                  }
                })
              }}>
                <ListItemIcon>
                  <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Logoff" />
              </ListItem>
            </List>


          </div>
        </div>
      </div>
    );
  }

  enderecoS() {
    return (
      <div>
        <div>
          {this.head()}

        </div>
      </div>
    );
  }

  head() {
    return (
      <div style={{ width: '100%', height: 65, backgroundColor: '#fff', flexDirection: 'row' }}>
        <label style={{ fontSize: 23, fontWeight: "bold", marginLeft: 15, marginTop: 16 }}>Usuário</label>
      </div>
    );
  }

  render() {
    return this.state.isLoading ? this.enderecoS() : this.form();
  }
}

const mapStateToProps = store => ({
  carrinho: store.CarrinhoReducer,
  pedidoA: store.PedidoAReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setCar, getCar, setCarEmp, setCurrentTab, setPedidoA }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Usuario);