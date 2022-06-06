import React, { Component } from 'react';
import api from './../../utilites/api';
import ListEnderecos from './../../fragments/listEndereco';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Skeleton from '@material-ui/lab/Skeleton';



export default class Endereco extends Component {

  state = {
    enderecos: [],
    colorHeader: 'red',
    idUser: '',
    isLoading: false,
    endPadrao: ''

  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    this.setState({
      endPadrao: localStorage.getItem('@webApp/enderecoId'),
    });

    if (localStorage.getItem('@webApp/userid') !== null) {
      console.log('fdsfd')
      this.setState({ idUser: localStorage.getItem('@webApp/userid') });
      this.getServidor();
    }
  }

  async getServidor() {
    try {
      const data = new FormData();
      data.append('id_user', localStorage.getItem('@webApp/userid'));

      const response = await api.post('ws/ListEndereco.php', data);
      console.log("resposta ", response.data)
      if (response.status === 200) {
        this.setState({
          enderecos: response.data
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

  async Excluir(id) {
    try {
      const data = new FormData();
      data.append('id', id);

      const response = await api.post('ws/Ex_Endereco.php', data);
      console.log("resposta ", response.data)
      if (response.status === 200) {

      } else {
        alert('Erro na comunicação com  servidor!', 'Atenção', false);
      }

    } catch (error) {
      console.log('Erro ', error)
      alert('Erro na comunicação com servidor!', 'Atenção', false);
    }

    this.getServidor()
  }

  async preecherTab(i) {
    localStorage.setItem('@webApp/enderecoNome', i.Nome);
    localStorage.setItem('@webApp/enderecoEnd', i.Rua);
    localStorage.setItem('@webApp/enderecoBairro', i.Bairro);
    localStorage.setItem('@webApp/enderecoValor', i.Valor);
    localStorage.setItem('@webApp/enderecoNumero', i.Numero);
    localStorage.setItem('@webApp/enderecoId', i.id);

    this.props.history.goBack()
  }

  form() {
    return (
      <div>
        <div>
          {this.header()}
          <div style={{ marginTop: 10, marginLeft: 15, marginRight: 15, width: '100%' }}>
            {this.state.enderecos.map(i => (
              <ListEnderecos Nome={i.Nome} Endereco={i.Rua} idDefault={this.state.endPadrao === i.id ? true : false}
                Press={async () => {
                  this.setState({ isLoading: true });
                  localStorage.setItem('@webApp/enderecoNome', null);
                  localStorage.setItem('@webApp/enderecoEnd', null);
                  localStorage.setItem('@webApp/enderecoBairro', null);
                  localStorage.setItem('@webApp/enderecoValor', null);
                  localStorage.setItem('@webApp/enderecoNumero', null);
                  localStorage.setItem('@webApp/enderecoId', null);
                  this.preecherTab(i);
                }}

                Excluir={async () => {
                  this.setState({ isLoading: true });
                  localStorage.setItem('@webApp/enderecoNome', null);
                  localStorage.setItem('@webApp/enderecoEnd', null);
                  localStorage.setItem('@webApp/enderecoBairro', null);
                  localStorage.setItem('@webApp/enderecoValor', null);
                  localStorage.setItem('@webApp/enderecoNumero', null);
                  localStorage.setItem('@webApp/enderecoId', null);
                  this.Excluir(i.id)

                }}
              />
            ))}
          </div>
        </div>
        <div>
          <div style={{ backgroundColor: 'green', marginTop: 20 }}>
            <Button variant="contained" color="primary" style={{ width: '100%' }} onClick={() => {
              this.props.history.push({
                pathname: '/CadEndereco',
                state: {
                  quemChamou: 'List',
                }
              })
            }}>
              <label style={{ color: 'white' }}>Novo endereço</label>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  enderecoS() {
    return (
      <div>
        <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
        <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
        <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
        <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
        <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
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
            <label style={{ fontSize: 28, fontWeight: "bold", color: '#fff' }}>Endereço</label>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.state.isLoading ? this.enderecoS() : this.form();
  }
}