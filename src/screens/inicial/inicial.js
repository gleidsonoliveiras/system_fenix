import React, { Component } from 'react';
import logo from './../../assets/logo.png';
//import fundo from './../../../assets/fundo.jpeg';
// import { Container } from './styles';

import { setPedidoA } from './../../redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InstagramIcon from '@material-ui/icons/Instagram';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';

class Inicial extends Component {

  async componentDidMount() {
    console.log('Teste', this.props.location.state.servico)
    console.log('Teste3', this.props.pedidoA.pedidoA)
  }
  render() {
    return (
      <div style={{ flex: 1, width: '100%' }}>

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

          <a style={{ flexDirection: 'row', marginTop: 30, backgroundColor: "#991e25", width: 190, justifyContent: 'space-between' }}
            onClick={() => {
              this.props.history.push({
                pathname: '/Main',
                state: {
                  pedidos: 0,
                }
              })
              // this.props.navigation.replace('Main',
              //   { pedidos: this.props.navigation.getParam('pedidos', '') });
            }}
          >
            <div style={{ height: 40, flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <p style={{ fontSize: 15, color: 'white', width: '100%', textAlign: 'center' }}>Fazer um pedido</p>
            </div>
          </a>

          <a style={{ flexDirection: 'row', marginTop: 10, backgroundColor: "#991e25", width: 190, justifyContent: 'space-between' }}
            onClick={() => {
              this.props.history.push({
                pathname: '/Pedidos',
                state: {
                  pedidos: 0,
                }
              })
              // this.props.navigation.navigate('Pedidos',
              //   { pedidos: this.props.navigation.getParam('pedidos', '') });
            }}
          >
            <div style={{ height: 40, flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <p style={{ fontSize: 15, color: 'white', width: '100%', textAlign: 'center' }}>Meus pedidos</p>
            </div>
          </a>

          <div style={{ display: "flex", marginTop: 50, width: 200, justifyContent: 'space-between' }}>
            <a style={{ width: 40, height: 40, alignItems: 'center' }} onClick={() => {
              window.open('https://www.instagram.com/fenix__sistemas/');
            }}>
              <InstagramIcon style={{ fontSize: 40, color: '#991e25' }} />
            </a>
            <div style={{ width: 40, height: 40, alignItems: 'center' }} onClick={() => {
              window.open('https://api.whatsapp.com/send?phone=558196798640&data=AbvJe2XDlwgR_gYeZ6tt2N-Mh5uAwwMnX8TWOpYC3JDNvvFBjsRZESxXui6at63zzkcD2LkGU21SUWfqeEAD_Owv6YoJwui0vnA3HDoO4GyFo-7C-nyJR4TcjhiUwbRBCVE&source=FB_Ads&fbclid=IwAR3Iho4uch2202Ori14BDnOqmiftVzcUPCJ6zRd2cO5oXaqBARzLnoh0k5Q');
            }}>
              <WhatsAppIcon style={{ fontSize: 40, color: '#991e25' }} />
            </div>
            
          </div>


          <div>
            {this.props.location.state.servico === '5' ?
              <div style={{ height: 40, flexDirection: 'row', alignItems: 'center', marginTop: 20, width: "100%", justifyContent: 'center' }}>
                <p style={{ fontSize: 18, color: 'green', fontWeight: 'bold' }}>Estamos abertos</p>
              </div>
              :
              <div style={{ height: 40, flexDirection: 'row', alignItems: 'center', marginTop: 20, width: "100%", justifyContent: 'center' }}>
                <p style={{ fontSize: 18, color: 'red', fontWeight: 'bold' }}>Estamos fechado</p>
              </div>
            }
          </div>

          {/* <View style={{ flexDirection: 'row', width: 190, justifyContent: 'space-between', marginTop: 25 }}>
                <Text style={{ fontSize: 15, width: '100%', textAlign: 'center', color: '#000' ,fontWeight: 'bold' }}>Aberto de terça a domingo das 18hrs as 23:00hrs</Text>
              </View> */}


        </div>

      </div >
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
)(Inicial);
