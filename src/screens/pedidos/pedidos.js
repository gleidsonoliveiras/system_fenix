import React, { Component } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Skeleton from '@material-ui/lab/Skeleton';
import api from './../../utilites/api';
import { setPedidoA } from './../../redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LisPedidos from './../../fragments/listPedidos'

class Pedidos extends Component {
  state = {
    pedidos: [],
    idUser: '',
    nomeUser: '',
    isLoading: false,
    colorHeader: 'red',
    endPadrao: ''
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    this.getServidor()
  }

  async getServidor() {
    try {

      const {
        setPedidoA
      } = this.props;



      const data = new FormData();
      data.append('cliente', localStorage.getItem('@webApp/userid') + '-' + localStorage.getItem('@webApp/username'));

      const response = await api.post('ws/list_pedidos.php', data);
      const response2 = await api.post('ws/PedidoAberto1.php', data);
      console.log("resposta ", response.data);
      console.log("resposta ", response2.data);

      setPedidoA("0");

      if (response.status === 200) {
        this.setState({
          enderecos: response.data
        });
        this.setState({
          pedidos: response.data
        });
      } else {
        alert('Erro na comunicação com  servidor!', 'Atenção', false);
      }

    } catch (error) {
      console.log('Erro ', error)
      alert('Erro na comunicação com servidor!', 'Atenção', false);
    }

    this.setState({ isLoading: false });
  }

  form() {
    return (
      <div>
        <div>
          {this.header()}
          <div style={{ marginTop: 10, marginLeft: 15, marginRight: 15 }}>
            {this.state.pedidos.map(i => (
              <LisPedidos Data={i.Data} Valor={i.Valor} Status={i.Status} Itens={i.Itens} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  enderecoS() {
    return (
      <div>
        <div>
          {this.header()}
          <div style={{ marginTop: 10, marginLeft: 15, marginRight: 15 }}>
            <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
            <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
            <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
            <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
            <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
          </div>
        </div>
      </div>
    );
  }

  header() {
    return (
      <div style={{ marginTop: 0, display: "flex", justifyContent: 'space-between', height: 60, paddingLeft: 0, paddingRight: 15, backgroundColor: this.state.colorHeader }}>
        <div style={{ marginLeft: 15, marginTop: 13, display: "flex" }}>
          <a style={{ height: 48, width: 30, flexDirection: 'row', alignItems: 'center', marginTop: 4 }} onClick={() => {
            this.props.history.goBack()
          }}>
            <ArrowBackIcon style={{ color: '#fff' }} />
          </a>
          <div style={{ height: 48, flexDirection: 'row', alignItems: 'center', marginTop: -2, marginLeft: 10 }}>
            <label style={{ fontSize: 28, fontWeight: "bold", color: '#fff' }}>Pedidos</label>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.state.isLoading ? this.enderecoS() : this.form();
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
)(Pedidos);
