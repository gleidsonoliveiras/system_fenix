import React, { Component } from 'react';
import logo from './../../assets/logo.png';
//import fundo from './../assets/fundo.jpeg';
import api from './../../utilites/api';
import { MAlert } from './../../utilites/utilites';
import CircularProgress from '@material-ui/core/CircularProgress';
import { setPedidoA } from './../../redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

var tt = '';



class Splash extends Component {

  state = {
    hasPermission: false
  }

  async componentDidMount() {

    try {
      const response = await api.post('ws/StatusServico.php');

      const userName = localStorage.getItem('@webApp/username');
      const userId = localStorage.getItem('@webApp/userid');
      console.log('Usuario: ', userId)
      console.log('resposta2: ', response.data)
      if (response.status === 200) {

        if (userId !== null) {
          this.getServidor(userId, response.data.Codigo, userName)
        } else {
          // this.props.navigation.replace('Login', {
          //   servico: response.data.Codigo
          // });
          this.props.history.push({
            pathname: '/Login',
            state: {
              servico: response.data.Codigo,
            }
          })
        }
      } else {
        console.log('eroo ')
        alert('Erro na comunicação com servidor!', 'Atenção');
      }

    } catch (error) {
      console.log('eroo ', error)
      alert('Erro na comunicação com servidor!', 'Atenção');
    }

  }
  componentWillUnmount() { }

  async getServidor(id, Codigo, Nome) {
    const token = await tt
    console.log('token firebase ', token)
    const data = new FormData();
    data.append('token', token);
    data.append('usuario', id);
    data.append('Cliente', id + '-' + Nome);
    const response = await api.post('ws/setToken.php', data);
    const response2 = await api.post('ws/PedidoAberto.php', data);
    console.log('resposta2', response2.data)
    console.log('resposta', response.data)

    const {
      setPedidoA
    } = this.props;

    setPedidoA(response2.data.Codigo);

    // this.props.navigation.replace('Inicial', {
    //   servico: Codigo,
    //   pedidos: response2.data.Codigo === "1" ? true : false
    // });

    this.props.history.push({
      pathname: '/Home',
      state: {
        servico: Codigo,
      }
    })
  }

  getToken = async () => {
    //get the messeging token

  }

  render() {

    return (
      <div style={{ flex: 1, width: '100%' }}>
        <div style={{ background: '#fff' }}>
          <div style={{
            alignItems: 'center',
            marginTop: 200,
            display: "flex",
            flexDirection: 'column',
            width: '100%',
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
            <div>
              <img src={logo} style={{
                width: 200,
                height: 200,
              }} />
            </div>
            <CircularProgress style={{ marginTop: 40 }} />
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  pedidoA: store.PedidoAReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setPedidoA }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Splash);

