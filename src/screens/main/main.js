import React, { Component } from 'react';
import styles from './styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PersonIcon from '@material-ui/icons/Person';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';

import Home from './home/home';
import Carrinho from './carrinho/carrinho'
import Usuario from './usuario/usuario'

import api from './../../utilites/api';
//import Home from './home/home'
//import Carrinho from './carrinho/carrinho'
//import Usuario from './usuario/usuario'

import { setCar, getCar, setCarEmp, setCurrentTab, setPedidoA } from './../../redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Main extends Component {
  state = {
    idUser: '',
    endPadrao: '',
    auth_token: '',
    value: 0
  }

  async componentDidMount() {

  }

  handleChange = (event, newValue) => {
    const {
      setCurrentTab
    } = this.props;
    setCurrentTab(newValue);
    this.setState({ value: newValue });
  };

  async getServidor() {
    try {
      const data = new FormData();
      data.append('token', this.state.auth_token);
      data.append('user_id', this.state.idUser);

      // const response = await api.post('public/api/get-user-notifications', data);
      // console.log("resposta ", response.data)
      // if (response.status === 200) {
      //   this.setState({
      //     not: [...response.data],
      //   });

      //   this.state.not.map(i => (
      //     this.setState({ numNotificacao: this.state.numNotificacao + (i.is_read === 0 ? 1 : 0) })
      //   ));

      //   console.log('Notificacões: ', this.state.numNotificacao);
      // }

    } catch (error) {
      console.log('Erro: ', error)
    }
  }


  render() {

    const theme = createMuiTheme({
      palette: {
        primary: {
          main: blueGrey[200],
        }
      },
    });

    return (
      <div>
        <div style={{ width: '100%', backgroundColor: '#fff' }}>
          {this.renderJanelas()}
        </div>
        <div style={{ bottom: 0, position: "fixed", width: '100%', backgroundColor: '#fff', height: 75 }}>
          <ThemeProvider theme={theme}>
            <BottomNavigation value={this.state.value} onChange={this.handleChange} style={{ width: '100%' }}>
              <BottomNavigationAction label="Inicio" value={0} icon={<HomeIcon />} />
              <BottomNavigationAction label="Carrinho" value={1} icon={<ShoppingCartIcon />} />
              <BottomNavigationAction label="Usuário" value={2} icon={<PersonIcon />} />
            </BottomNavigation>
          </ThemeProvider>
        </div>
      </div>

    );
  }

  // rodape() {

  //   const {
  //     setCurrentTab
  //   } = this.props;

  //   return (
  //     <Footer style={{ height: 80 }}>
  //       <FooterTab style={{ backgroundColor: '#fff' }}>
  //         <Button vertical onPress={() => { setCurrentTab(0); }}>
  //           <Icon name="home" type="AntDesign" style={{ color: '#4d4d4d', fontSize: 25 }} />
  //           <Text style={this.props.currentTab.currentTab === 0 ? styles.tabAtivo : styles.tabInativo}>Inicio</Text>
  //         </Button>
  //         {Object.entries(this.props.carrinho.carrinho).length > 0 ?
  //           <Button vertical badge onPress={() => { setCurrentTab(1); }}>
  //             <Badge><Text>{Object.entries(this.props.carrinho.carrinho).length}</Text></Badge>
  //             <Icon name="shoppingcart" type="AntDesign" style={{ color: '#4d4d4d', fontSize: 25 }} />
  //             <Text style={this.props.currentTab.currentTab === 1 ? styles.tabAtivo : styles.tabInativo}>Carrinho</Text>
  //           </Button> :
  //           <Button vertical onPress={() => { setCurrentTab(1); }}>
  //             <Icon name="shoppingcart" type="AntDesign" style={{ color: '#4d4d4d', fontSize: 25 }} />
  //             <Text style={this.props.currentTab.currentTab === 1 ? styles.tabAtivo : styles.tabInativo}>Carrinho</Text>
  //           </Button>
  //         }
  //         {this.props.pedidoA.pedidoA === "1" ?
  //           <Button badge vertical onPress={() => { setCurrentTab(2); }}>
  //             <Badge ><Text style={{ color: 'red' }}>  </Text></Badge>
  //             <Icon name="user" type="AntDesign" style={{ color: '#4d4d4d', fontSize: 25 }} />
  //             <Text style={this.props.currentTab.currentTab === 2 ? styles.tabAtivo : styles.tabInativo}>Conta</Text>
  //           </Button>
  //           :
  //           <Button vertical onPress={() => { setCurrentTab(2); }}>
  //             <Icon name="user" type="AntDesign" style={{ color: '#4d4d4d', fontSize: 25 }} />
  //             <Text style={this.props.currentTab.currentTab === 2 ? styles.tabAtivo : styles.tabInativo}>Conta</Text>
  //           </Button>
  //         }

  //       </FooterTab>
  //     </Footer>
  //   );
  // }

  renderJanelas() {
    if (this.props.currentTab.currentTab === 0) {
      return <Home history={this.props.history}/>
    } else if (this.props.currentTab.currentTab === 1) {
      return <Carrinho history={this.props.history} />
    } else if (this.props.currentTab.currentTab === 2) {
      return <Usuario history={this.props.history} />
    } else if (this.props.currentTab.currentTab === 3) {
      // return <Carrinho navigation={this.props.navigation} />
    } else if (this.props.currentTab.currentTab === 4) {
      // return <Usuario navigation={this.props.navigation} />
    }
  }

}


const mapStateToProps = store => ({
  carrinho: store.CarrinhoReducer,
  currentTab: store.CurrentTabReducer,
  pedidoA: store.PedidoAReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setCar, getCar, setCarEmp, setCurrentTab, setPedidoA }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
