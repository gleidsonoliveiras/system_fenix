import React, { Component } from 'react';
import Valid from './validarEndereco';
import api from './../../utilites/api';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Skeleton from '@material-ui/lab/Skeleton';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


export default class CadEndereco extends Component {

  state = {
    titulo: '',
    end: '',
    colorHeader: 'red',
    numero: '',
    bairro: '',
    cep: '',
    obs: '',
    bairros: [],

    idUser: '',
    auth_token: '',
    isLoading: false,
    default_address_id: ''
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    this.setState({
      idUser: localStorage.getItem('@webApp/userid'),
      auth_token: '',
      endPadrao: ''
    });


    this.getCoordinates();
    this.setState({ isLoading: false });
  }

  handleSubimit = async () => {
    console.log('Resposta: ', 'response.data')
    if (Valid(this.state)) {

      this.setState({ isLoading: true });
      const data = new FormData();
      data.append('nome', this.state.titulo);
      data.append('rua', this.state.end);
      data.append('numero', this.state.numero);
      data.append('bairro', this.state.bairro);
      data.append('complemento', this.state.obs);
      data.append('idUser', this.state.idUser);

      const response = await api.post('ws/CadEndereco.php', data);
      if (response.status === 200) {
        console.log('Resposta: ', response.data)

        this.preecherTab();

      } else {
        alert('Erro na comunicação com servidor!', 'Atenção', false);
        this.setState({ isLoading: false });
      }

    } else {
      alert('Informe todos os dados marcados com ( * )', 'Atenção', false);
      this.setState({ isLoading: false });
    }
  }

  async getCoordinates() {


    try {
      const response = await api.post('ws/ListBairros.php');
      console.log('resposta: ', response.data)
      if (response.status === 200) {
        var tem = [];
        tem = response.data;
        tem.unshift({ "id": "0", "nome": "Selecione seu bairro", "valor": "" });
        if (response.data !== '[]') {
          this.setState({
            bairros: tem
          });
        }
      } else {
        alert('Erro na comunicação com  servidor!', 'Atenção', false);
      }

    } catch (error) {
      console.log('eroo ', error)
      alert('Erro na comunicação com servidor!', 'Atenção', false);
    }

  }

  onValueChange(value) {
    this.setState({
      bairro: value
    });
  }

  async preecherTab() {
    localStorage.setItem('@webApp/enderecoNome', this.state.titulo);
    localStorage.setItem('@webApp/enderecoEnd', this.state.end);
    localStorage.setItem('@webApp/enderecoBairro', this.state.bairro);
    localStorage.setItem('@webApp/enderecoNumero', this.state.numero);

    this.props.history.goBack();
  }

  form() {
    return (
      <div>
        <div>
          {this.header()}
          <div style={{ marginTop: 10, marginLeft: 18, marginRight: 18 }}>

            <div style={{ marginTop: 25, justifyContent: 'space-between' }}>
              <label style={{ fontSize: 13, color: 'red' }}>Atenção: Verifique se atendemos o seu bairro</label>
            </div>

            <div style={{ marginLeft: 0, marginRight: 0, width: '100%', marginBottom: 30 }}>
              <label>Bairro *:</label>
              <Select
                id="demo-simple-select"
                value={this.state.bairro}
                onChange={this.handleChange2}
                style={{ width: '100%' }}
              >
                {this.state.bairros.map(i => (
                  <MenuItem key={i.nome} value={i.nome}>
                    {i.nome} {i.valor !== '' ? ` - R$ ${this.mascaraValor(eval(parseFloat(i.valor)).toFixed(2))}` : ''}
                  </MenuItem>
                ))}

              </Select>
            </div>

            {this.state.bairro !== '' && this.state.bairro !== 'Selecione seu bairro' ? this.restoInf() : null}

          </div>
        </div>
        <div>
          <div style={{ marginLeft: 18, }}>
            {this.state.isLoading ?
              <div style={{ width: '100%' }}>
                <p style={{ color: 'white' }}>Carregando</p>
              </div> :
              <Button variant="contained" color="primary" style={{ width: '95%', marginTop: 25 }}
                onClick={this.handleSubimit}>
                Cadastrar
              </Button>}
          </div>
        </div>
      </div>
    );
  }

  handleChange2 = (event) => {
    this.setState({ bairro: event.target.value });
  }

  restoInf() {
    return (
      <div>
        <div style={{ width: '100%', marginBottom: 30 }}>
          <label>Nome (ex: Minha casa, meu trabalho, casa da mãe) *</label>
          <Input
            value={this.state.titulo}
            useNativeDriver={true}
            disabled={this.state.isLoading}
            style={{ width: "99%" }}
            name="titulo"
            onChange={this.handleChange}
          />
        </div>

        <div style={{ width: '100%', marginBottom: 30 }}>
          <label>Seu endereço (Rua) *</label>
          <Input
            value={this.state.end}
            useNativeDriver={true}
            disabled={this.state.isLoading}
            style={{ width: "99%" }}
            name="end"
            onChange={this.handleChange}
          />
        </div>

        <div style={{ width: '100%', marginBottom: 30 }}>
          <label>Numero *</label>
          <Input
            value={this.state.numero}
            useNativeDriver={true}
            style={{ width: "99%" }}
            disabled={this.state.isLoading}
            name="numero"
            onChange={this.handleChange}
          />
        </div>

        {/* <Item stackedLabel style={{ marginTop: 25 }}>
          <Label style={{ fontSize: 13 }}>CEP</Label>
          <Input
            ref='Field4'
            editable={!this.state.isLoading}
            value={this.state.cep}
            useNativeDriver={true}
            onChangeText={cep => this.setState({ cep })}
          />
        </Item> */}

        <div stackedLabel style={{ marginTop: 25 }}>
          <label>Complemento</label>
          <Input
            value={this.state.obs}
            useNativeDriver={true}
            style={{ width: "99%" }}
            disabled={this.state.isLoading}
            name="obs"
            onChange={this.handleChange}
          />
        </div>
      </div>
    )
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

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
    return this.form();
  }

  mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return valor
  }
}