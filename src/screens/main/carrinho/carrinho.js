import React, { Component } from 'react';
import { setCar, setCarEmp, setCurrentTab } from './../../../redux/actions/';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ListCarrinho from './../../../fragments/listCarrinho';
import api from './../../../utilites/api'
import Carregando from '../../../fragments/carregando2';
import CheckIcon from '@material-ui/icons/Check';
import MenuItem from '@material-ui/core/MenuItem';
import { Modal } from 'react-bootstrap';
import './carrinho.css'

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


class Carrinho extends Component {
  state = {
    listaEnd: false,
    codEmpresa: 0,
    retirada: false,
    enderecoNome: '',
    enderedoEnd: '',
    enderedoNumero: '',
    enderecoValor: 0,
    enderecoBairro: '',
    cupom: '',
    nf: 'Sim',
    obs: '',
    time: "",
    date: '',
    ativo: true,

    vlEntrega: '0',
    vlCupom: '0',
    vl: '0',

    pagamento: 'Dinheiro',
    isCupom: false,
    isLoading: false,
    userNome: '',
    userTelefone: '',
    isMoto: false,
    isAgend: false,
    isTroco: true,
    isFisc: false,
    vlTroco: '0',
    notaFiscal: '',
    qtdFidel: "9",
    descFidel: 10,
    fidel: 0,
    aplicFidelidade: false,
    vlMinimo: 1,
    open: false,
    end_id: 0,
    enderecosEmpresa: []

  }

  vl = 0;
  vlAdc = 0;
  aplica = true;

  async componentDidMount() {
    this.setState({ isLoading: true });


    const response5 = await api.post('ws/ListEmpresas.php');
    console.log(response5)

    function jsonEscape(str) {
      return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
    }

    if (response5.status == 200) {
      console.log(JSON.parse(jsonEscape(response5.data)))
      this.setState({ enderecosEmpresa: JSON.parse(jsonEscape(response5.data)) })
    }

    this.setState({
      userNome: localStorage.getItem('@webApp/userid') + '-' + localStorage.getItem('@webApp/username'),
      userTelefone: localStorage.getItem('@webApp/usertelefone'), end_id: localStorage.getItem('@webApp/enderecoId')
    });


    if (localStorage.getItem('@webApp/enderecoNome') !== null) {
      this.setState({
        enderecoNome: localStorage.getItem('@webApp/enderecoNome'),
        enderedoEnd: localStorage.getItem('@webApp/enderecoEnd'),
        enderecoBairro: localStorage.getItem('@webApp/enderecoBairro'),
        enderecoValor: localStorage.getItem('@webApp/enderecoValor'),
        enderedoNumero: localStorage.getItem('@webApp/enderecoNumero'),
      });
      this.getServidor();
    } else {
      this.setState({ isLoading: false });
    }

  }

  async getServidor() {

    this.props.carr.carrinho.map(i => (
      this.vl = 0
    ));

    this.props.carr.carrinho.map(i => (
      this.vl = parseFloat(this.vl) + parseFloat(i.preco)
    ));



    this.setState({ time: new Date().getHours() + ":" + new Date().getMinutes() })
    if (this.state.enderecoBairro !== '0') {
      try {
        const data = new FormData();
        data.append('bairro', localStorage.getItem('@webApp/enderecoBairro'));
        data.append('Cliente', this.state.userNome);
        console.log('resposta1: ', this.state.enderecoBairro)
        const response = await api.post('ws/getVlEntrega.php', data);
        const response3 = await api.post('ws/StatusServico.php');
        const response4 = await api.post('ws/getFidel.php', data);
        console.log('resposta2: ', response.data)
        if (response.status === 200) {
          if (response.status !== '[]') {
            this.setState({
              vlEntrega: response.data.valor,
              ativo: response3.data.Codigo === '5' ? true : false,
              fidel: response4.data.compras,
            });

            console.log('Aplica pontos: ', this.state.fidel)
            if (this.state.fidel === this.state.qtdFidel) {
              var x = (parseFloat(this.vl) * parseFloat(this.state.descFidel)) / 100
              this.setState({
                vlCupom: x,
                aplicFidelidade: true
              });
            }

          }

        } else {
          alert('Erro na comunicação com  servidor!', 'Atenção', false);
        }

      } catch (error) {
        console.log('eroo ', error)
        alert('Erro na comunicação com servidor!', 'Atenção', false);
      }
    } else {
      this.setState({
        vlEntrega: '0',
        enderedoEnd: 'Retirada no local'
      });
    }

    this.setState({ isLoading: false });
  }

  handleChange2 = (event) => {
    this.setState({ pagamento: event.target.value });
  }

  handleEndereco = (empresa) => {
    this.setState({
      listaEnd: false, codEmpresa: empresa.id, retirada: true
      , enderecoNome: empresa.endereco.split(`\\r\\n`).map((e, i) => { if (i > 0) return ' ' + e; else { return e } }),
      enderedoEnd: empresa.nome,
      enderedoNumero: '0',
      enderecoValor: 0,
      enderecoBairro: '0 - local',
      vlEntrega: '0',
      end_id: "0"
    });
  }

  handleCupom = async () => {
    this.setState({ isLoading: true });
    try {
      const data = new FormData();
      data.append('titulo', this.state.cupom);

      const response = await api.post('ws/ValidCupom.php', data);
      console.log('resposta: ', response.data)
      if (response.status === 200) {
        if (response.data.Descricao !== 'Cupom invalido') {
          var x = (parseFloat(this.vl) * parseFloat(response.data.percent)) / 100
          this.setState({
            vlCupom: x,
            isCupom: true
          });
        } else {
          alert(response.data.Descricao, 'Atenção', false);
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

  async handlleEnviarPedido() {
    this.setState({ isLoading: true });
    var teste = '';
    var order = {}
    var Capa = [];
    console.log("Hora ", this.state.time)


    try {
      Capa = [...Capa, {
        cliente: this.state.userNome,
        retirada: this.state.retirada,
        codEmpresa: this.state.codEmpresa,
        endereco: this.state.enderedoEnd + ', ' + this.state.enderedoNumero + ', ' + this.state.enderecoBairro,
        telefone: this.state.userTelefone,
        troco: String(this.state.vlTroco).replace(",", "."),
        valor: (parseFloat(this.vl) + parseFloat(this.state.vlEntrega) + (this.state.pagamento === 'Cartao' ? parseFloat(this.vlAdc) : 0)) - parseFloat(this.state.vlCupom),
        pagamento: this.state.pagamento, entrega: this.state.vlEntrega,
        id_endereco: this.state.end_id,
        obs:
          (this.state.vlTroco !== "" ? " -- Troco para: R$ " + this.state.vlTroco : "") +
          (this.state.notaFiscal !== "" ? " -- NFe para: " + this.state.notaFiscal : ""),
        bairro: this.state.enderecoBairro,
        cupom: this.state.vlCupom !== '0' ? this.state.cupom : '',
        aplicFidelidade: this.state.aplicFidelidade
      }];
      var Itens = [];

      var Temp = this.props.carr.carrinho;
      var Id_adc = '';
      for (var i = 0; i < Temp.length; i++) {
        var x = '';
        console.log('Ret ', i)
        var Temp2 = this.props.carr.carrinho[i].motagem;
        Id_adc = '';
        for (var j = 0; j < Temp2.length; j++) {
          x = x + '(' + this.props.carr.carrinho[i].motagem[j] + ": ";
          var Temp3 = this.props.carr.carrinho[i].motagem[j];

          for (var y = 0; y < this.props.carr.carrinho[i][Temp3].length; y++) {
            x = x + this.props.carr.carrinho[i][Temp3][y].split("@")[1] + ', ';
            Id_adc = Id_adc + this.props.carr.carrinho[i][Temp3][y].split("@")[0] + ', ';
          }
          x = x + ') ';
        }

        Itens = [...Itens, {
          produto: this.props.carr.carrinho[i].id + ' - ' + this.props.carr.carrinho[i].nome, quantidade: this.props.carr.carrinho[i].quant, valor: this.props.carr.carrinho[i].preco,
          observacao: this.props.carr.carrinho[i].observacao, adcionais: x, id_adc: Id_adc, id_prod: this.props.carr.carrinho[i].id,
          adicional_cartao: (this.state.pagamento === 'Cartao' ? this.props.carr.carrinho[i].adicional_cartao : 0)
        }]


      }

      // console.log('Capa ', JSON.stringify(Capa))
      // console.log('Itens ', JSON.stringify(Itens))

      const data = new FormData();
      data.append('JSon', JSON.stringify(Capa));
      data.append('JSon2', JSON.stringify(Itens));
      console.log('Env ', JSON.stringify(Capa))
      const response = await api.post('ws/finalizar_pedido.php', data);
      console.log('Ret ', response.data)


      if (response.status === 200 && response.data.Codigo === '100') {
        console.log('Pedido ', response.data);
        var arr = [];

        const {
          setCarEmp
        } = this.props;

        setCarEmp(arr);

        alert('Pedido realizado com sucesso!', 'Atenção', false);

        this.props.history.push({
          pathname: '/'
        })
        const {
          setCurrentTab
        } = this.props;
        setCurrentTab(0);
      } else {
        alert('Erro na comunicação com  servidor!', 'Atenção', false);
      }

    } catch (error) {
      console.log('Erro ', error)
      alert('Erro na comunicação com servidor!', 'Atenção', false);
    }

    this.setState({ isLoading: false });


  }

  formatMoney(valor) {
    const v = ((valor.replace(/\D/g, '') / 100).toFixed(2) + '').split('.');

    const m = v[0].split('').reverse().join('').match(/.{1,3}/g);

    for (let i = 0; i < m.length; i++)
      m[i] = m[i].split('').reverse().join('') + '.';

    const r = m.reverse().join('');

    return r.substring(0, r.lastIndexOf('.')) + ',' + v[1];
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChange2 = e => {
    this.setState({ [e.target.name]: this.formatMoney(e.target.value) });
  };

  retornaAdc(i) {
    var Temp = this.props.carr.carrinho;

    var x = '';


    console.log('Ret ', i)
    var Temp2 = this.props.carr.carrinho[i].motagem;

    for (var j = 0; j < Temp2.length; j++) {
      x = x + '(' + this.props.carr.carrinho[i].motagem[j] + ": ";
      var Temp3 = this.props.carr.carrinho[i].motagem[j];
      for (var y = 0; y < this.props.carr.carrinho[i][Temp3].length; y++) {
        x = x + this.props.carr.carrinho[i][Temp3][y].split("@")[1] + ', ';
      }
      x = x + ') ';
    }

    return x;

  }


  form() {

    this.props.carr.carrinho.map(i => (
      this.vl = 0
    ));

    this.props.carr.carrinho.map(i => (
      this.vlAdc = 0
    ));

    this.props.carr.carrinho.map(i => (
      this.vl = parseFloat(this.vl) + parseFloat(i.preco)
    ));

    this.props.carr.carrinho.map(i => (
      this.vlAdc = parseFloat(this.vlAdc) + (parseFloat(i.adicional_cartao) * parseFloat(i.quant))
    ));

    return (
      <div>
        <div>
          <div style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5, paddingLeft: 5, paddingRight: 15, }}>
            <div>
              <label style={{ fontSize: 28, fontWeight: "bold", marginLeft: 15, marginTop: 15 }}>Carrinho</label>
            </div>
          </div>
          <div style={{ marginLeft: 20, marginTop: 25 }}>
            <label style={{ fontSize: 15, fontWeight: "bold", }}>
              Itens do carrinho
          </label>
          </div>
          <div style={{ paddingLeft: 20, paddingRight: 10, marginTop: 10 }}>
            {this.props.carr.carrinho.map((i, d) => (
              <ListCarrinho qtd={i.quant} nome={i.nome} preco={i.preco} pos={d} adcionais={this.retornaAdc(d)} />
            ))}
          </div>
        </div>

        <div style={{ marginLeft: 21, marginTop: 10, paddingRight: 20, }}>
          <div style={{ marginBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontWeight: "bold", }}>Cupom de desconto</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '100%' }}>
              <Input
                keyboardType='numeric'
                value={this.state.cupom}
                useNativeDriver={true}
                disabled={this.state.isCodigo}
                style={{ width: "99%" }}
                editable={!this.state.isCupom}
                name="cupom"
                onChange={this.handleChange}
              />
            </div>
            {this.state.isCupom ? null :
              <a style={{ width: "10%", height: 51, marginLeft: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                onClick={this.handleCupom}
              >
                <CheckIcon style={{ fontSize: 18 }} />
              </a>
            }
          </div>
        </div>

        {/* <div style={{ marginLeft: 21, marginTop: 20, paddingRight: 20, }}>
          <div style={{ marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontWeight: "bold", }}>Cartão fidelidade ( {this.state.fidel} / 10)</label>
          </div>
          <div style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Icon type='AntDesign' name={this.state.fidel >= 1 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 1 ? 'green' : '#D3D3D3' }} />
            <Icon type='AntDesign' name={this.state.fidel >= 2 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 2 ? 'green' : '#D3D3D3' }} />
            <Icon type='AntDesign' name={this.state.fidel >= 3 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 3 ? 'green' : '#D3D3D3' }} />
            <Icon type='AntDesign' name={this.state.fidel >= 4 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 4 ? 'green' : '#D3D3D3' }} />
            <Icon type='AntDesign' name={this.state.fidel >= 5 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 5 ? 'green' : '#D3D3D3' }} />
            <Icon type='AntDesign' name={this.state.fidel >= 6 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 6 ? 'green' : '#D3D3D3' }} />
            <Icon type='AntDesign' name={this.state.fidel >= 7 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 7 ? 'green' : '#D3D3D3' }} />
            <Icon type='AntDesign' name={this.state.fidel >= 8 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 8 ? 'green' : '#D3D3D3' }} />
            <Icon type='AntDesign' name={this.state.fidel >= 9 ? 'checkcircle' : 'closecircle'} style={{ fontSize: 18, color: this.state.fidel >= 9 ? 'green' : '#D3D3D3' }} />
          </div>
        </div> */}

        <div style={{ marginLeft: 21, marginTop: 25, paddingRight: 20, }}>
          <div style={{ marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontWeight: "bold", }}>{this.state.retirada ? 'Local de retirada' : 'Local da entrega'}</label>
          </div>
          <div>
            <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 15, fontWeight: 'bold' }}>{this.state.enderedoEnd} - {this.state.enderecoNome}</label>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <a onClick={() => {
              this.props.history.push({
                pathname: '/Endereco',
                state: {
                  quemChamou: 'Carrinho',
                }
              })
            }}>
              <label style={{ color: 'blue' }}>Mudar endereço</label>
            </a>
            <a onClick={() => {
              // this.setState({
              //   enderecoNome: 'Retirada no local',
              //   enderedoEnd: 'Retirada no local',
              //   enderedoNumero: '0',
              //   enderecoValor: 0,
              //   enderecoBairro: '0 - local',
              //   vlEntrega: '0',
              //   end_id: "0"
              // });
              this.setState({
                listaEnd: true
              })
              // alert('Tudo bem, você irá retirar o pedido em nosso endereço!', 'Alerta', false);
            }
            }>
              <label style={{ color: 'blue' }}>Retirada no local</label>
            </a>
          </div>
        </div>

        <div style={{ marginLeft: 21, marginTop: 25, }}>
          <div style={{ marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontWeight: "bold", }}>Meio de pagamento</label>
          </div>
          <div>
            <div
              style={{ width: '103%', marginTop: 10 }}>
              <div style={{ marginLeft: 0, marginRight: 30, width: '90%' }}>
                <Select
                  id="demo-simple-select"
                  value={this.state.pagamento}
                  onChange={this.handleChange}
                  name="pagamento"
                  style={{ width: '100%' }}
                >
                  <MenuItem key="Dinheiro" value="Dinheiro">
                    Dinheiro
                  </MenuItem>
                  <MenuItem key="Cartao" value="Cartao">
                    Cartão
                  </MenuItem>

                </Select>
                {/* <Picker
                  mode="dropdown"
                  iosHeader="Selecione"
                  iosIcon={<Icon name="arrow-down" />}
                  selectedValue={this.state.pagamento}
                  onValueChange={this.onValueChange.bind(this)}
                >
                  <Picker.Item label="Cartao de credito" value="Cartao de credito" />
                  <Picker.Item label="Dinheiro" value="Dinheiro" />
                  <Picker.Item label="Cartao de debito" value="Cartao de debito" />
                  <Picker.Item label="Transferência" value="Transferência" />

                </Picker> */}
              </div>
            </div>
          </div>
        </div>
        {this.state.pagamento === "Dinheiro" ?
          <div style={{ marginLeft: 21, marginTop: 25, }}>
            <div style={{ marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontWeight: "bold", }}>Troco para: </label>
            </div>
            <div>
              <div
                style={{ width: '103%', marginTop: 10 }}>
                <div style={{ marginLeft: 0, marginRight: 30, width: '90%' }}>
                  <Input
                    keyboardType='numeric'
                    value={this.state.vlTroco}
                    useNativeDriver={true}
                    disabled={this.state.isCodigo}
                    style={{ width: "99%" }}
                    editable={!this.state.isCupom}
                    name="vlTroco"
                    onChange={this.handleChange2}
                  />
                </div>
              </div>
            </div>
          </div>
          : null}


        <div style={{ marginLeft: 21, marginTop: 20, paddingRight: 20 }}>
          <div style={{ marginBottom: 5 }}>
            <label style={{ fontWeight: "bold", }}>Detalhes da conta</label>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 13, fontWeight: "bold", }}>Total dos itens: </label>
              <label style={{ fontSize: 13, fontWeight: "bold", }}>R$ {this.mascaraValor(eval(parseFloat(this.vl)).toFixed(2))}</label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 13, fontWeight: "bold", }}>Taxa de entrega: </label>
              <label style={{ fontSize: 13, fontWeight: "bold", }}>R$ {this.mascaraValor(eval(parseFloat(this.state.vlEntrega)).toFixed(2))}</label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 13, fontWeight: "bold", }}>Descontos: </label>
              <label style={{ fontSize: 13, fontWeight: "bold", }}>R$ {this.mascaraValor(eval(parseFloat(this.state.vlCupom)).toFixed(2))}</label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 13, fontWeight: "bold", }}>Adicional cartão: </label>
              <label style={{ fontSize: 13, fontWeight: "bold", }}>R$ {(this.state.pagamento === 'Cartao' ? this.mascaraValor(eval(parseFloat(this.vlAdc)).toFixed(2)) : "0,00")}</label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 13, fontWeight: "bold", }}>Total: </label>
              <label style={{ fontSize: 13, fontWeight: "bold", }}>R$ {this.mascaraValor(eval((parseFloat(this.vl) + parseFloat(this.state.vlEntrega) + (this.state.pagamento === 'Cartao' ? parseFloat(this.vlAdc) : parseFloat(0))) - parseFloat(this.state.vlCupom)).toFixed(2))}</label>
            </div>
          </div>
        </div>

        <div style={{ marginLeft: 21, marginTop: 30, paddingRight: 18, marginBottom: 40 }}>
          <Button variant="contained" color="primary" style={{ width: '100%' }} onClick={() => {
            if (this.state.ativo) {
              if (this.state.enderedoEnd !== '') {

                this.setState({ open: true })

              } else {
                alert('Informe o endereço de entrega!', 'Atenção', false);
              }
            } else {
              alert('Estamos fechado', 'Atenção', false);
            }
          }}>
            <label>Continuar</label>
          </Button>

          <div style={{ width: 20, height: 150 }}>

          </div>
        </div>

        <Modal
          onHide={() => this.setState({ listaEnd: false })}
          show={this.state.listaEnd}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Escolha um local para retirada</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul className="lista-endereços">{this.state.enderecosEmpresa.map(e => <li
              onClick={() => this.handleEndereco(e)}
            >
              <h4>{e.nome}</h4>
              {e.endereco.split(`\\r\\n`).map(p => <h6>
                {p}
              </h6>)}
            </li>)}</ul>
          </Modal.Body>

        </Modal>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Verificação"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {"Finalizar seu pedido? "}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { this.setState({ open: false }); }} color="primary">
              Cancelar
          </Button>
            <Button onClick={async () => {
              if (this.vl < this.state.vlMinimo) {
                alert("Valor minimo do pedido e de R$ 20,00", 'Atenção', false)
              } else {
                var Valid = 0;
                if (this.state.pagamento === "Dinheiro") {
                  if (this.state.vlTroco == 0) {
                    Valid = 1
                  } else {
                    var aa = parseFloat(this.state.vlTroco);
                    var bb = ((parseFloat(this.vl) + parseFloat(this.state.vlEntrega)) - parseFloat(this.state.vlCupom))

                    if (aa < bb) {
                      Valid = 0
                    } else {
                      Valid = 1
                    }
                  }
                } else {
                  Valid = 1
                }
                if (Valid === 0) {
                  alert("Valor do troco menor que o total do pedido.", 'Atenção', false)
                } else {
                  this.handlleEnviarPedido()
                }
              }
              this.setState({ open: false });
            }} color="primary" autoFocus>
              Ok
          </Button>
          </DialogActions>
        </Dialog>
      </div >
    );
  }

  mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return valor
  }

  onValueChange(value) {
    this.setState({
      pagamento: value
    });
  }

  // onValueChange2(value) {
  //   value === 'Sim' ? this.setState({ obs: '' }) : null
  //   this.setState({
  //     nf: value
  //   });
  // }

  render() {
    return (Object.entries(this.props.carr.carrinho).length > 0 ? (this.state.isLoading ? <Carregando /> : this.form()) : this.vazio());
  }

  vazio() {
    return (
      <div>
        <div>
          <div style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5, paddingLeft: 5, paddingRight: 15, }}>
            <div>
              <label style={{ fontSize: 28, fontWeight: "bold", marginLeft: 15, marginTop: 15 }}>Carrinho</label>
            </div>
          </div>
          <div style={{ marginTop: 100, alignItems: 'center', width: '100%' }}>
            <p style={{ marginTop: 20, textAlign: 'center', width: '100%', fontWeight: "bold", }}>Carrinho vazio</p>
          </div>
        </div>
      </div>
    );
  }

  mdFinal() {
    return (<div></div>
      // <Modal
      //   animationType="fade"
      //   transparent={true}
      //   visible={this.state.isMoto}
      //   onRequestClose={() => {
      //     this.setState({ isMoto: false })
      //   }}>
      //   <div style={{ flex: 1, marginTop: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', }}>
      //     <div style={{ flex: 1, marginTop: 100, backgroundColor: '#ffffff', borderTopRightRadius: 0, borderTopLeftRadius: 0 }}>
      //       <div style={{ marginTop: 10, marginLeft: 25 }}>
      //         <TouchableOpacity style={{ height: 40, width: 40 }} onPress={() => { this.setState({ isMoto: false }) }}>
      //           <Icon name="close" />
      //         </TouchableOpacity>
      //       </div>
      //       <Scrolldiv>
      //         <div><label style={{ fontSize: 12, fontWeight: 'bold', marginLeft: 15, marginBottom: 15 }}>ções finais</label></div>

      //         <ListItem>
      //           <CheckBox checked={this.state.isAgend} onPress={() => { this.setState({ isAgend: !this.state.isAgend }) }} />
      //           <Body>
      //             <label>Agendar entrega?</label>
      //           </Body>
      //         </ListItem>
      //         <div style={{ width: '100%', marginTop: 15, paddingLeft: 15, paddingRight: 15 }}>
      //           {this.state.isAgend ? <div>
      //             <div style={{ marginTop: 5, width: '100%', marginLeft: 10 }}>
      //               <DatePicker
      //                 style={{ width: 200 }}
      //                 date={this.state.date}
      //                 format="DD/MM/YYYY"
      //                 minDate={new Date().getDay() + "/" + new Date().getMonth() + "/" + new Date().getFullYear()}
      //                 maxDate="31-08-2025"
      //                 onDateChange={this.selectDate}
      //                 style={{ width: '100%' }}
      //               />
      //             </div>


      //             <div style={{ marginTop: 10, width: '100%', marginLeft: 10, flexDirection: 'row' }}>
      //               <label style={{
      //                 width: '87%',
      //                 labelAlign: 'center',
      //                 padding: 10,
      //                 borderColor: '#cccccc',
      //                 borderWidth: 1.3
      //               }} onPress={() => this.TimePicker.open()}>{this.state.time}</label>
      //               <TimePicker
      //                 ref={ref => {
      //                   this.TimePicker = ref;
      //                 }}
      //                 labelCancel="Cancelar"
      //                 labelConfirm="Gravar"
      //                 selectedHour={new Date().getHours() + ""}
      //                 selectedMinute={new Date().getMinutes() + ""}
      //                 onCancel={() => this.onCancel()}
      //                 onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
      //               />
      //               <TouchableOpacity style={{ width: 30, marginLeft: 10, marginTop: 5 }} iconLeft onPress={() => this.TimePicker.open()}>
      //                 <Icon type="Ionicons" name="md-time" style={{ color: "#000" }} />
      //               </TouchableOpacity>

      //             </div>
      //           </div> : null}

      //         </div>

      //         {this.state.pagamento === 'Dinheiro' ?
      //           <ListItem>
      //             <CheckBox checked={this.state.isToco} onPress={() => { this.setState({ isToco: !this.state.isToco }) }} />
      //             <Body>
      //               <label>Deseja troco?</label>
      //             </Body>
      //           </ListItem> : null
      //         }

      //         <div style={{ width: '100%', marginTop: 15, paddingLeft: 15, paddingRight: 15 }}>
      //           {this.state.isToco ? <div>
      //             <div style={{ marginTop: 20, width: '100%' }}>
      //               <div style={{ marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      //                 <label style={{ fontWeight: "bold", }}>Valor para troco: </label>
      //               </div>
      //               <div>
      //                 <div style={{ marginTop: 15, }}>
      //                   <Item>
      //                     <Input
      //                       value={this.state.vlTroco}
      //                       onChangelabel={vlTroco => this.setState({ vlTroco })}
      //                     />
      //                   </Item>
      //                 </div>
      //               </div>
      //             </div>
      //           </div> : null}
      //         </div>

      //         <ListItem>
      //           <CheckBox checked={this.state.isFisc} onPress={() => { this.setState({ isFisc: !this.state.isFisc }) }} />
      //           <Body>
      //             <label>Nota Fiscal?</label>
      //           </Body>
      //         </ListItem>
      //         <div style={{ width: '100%', marginTop: 15, paddingLeft: 15, paddingRight: 15 }}>
      //           {this.state.isFisc ? <div>
      //             <div style={{ marginTop: 20, width: '100%' }}>
      //               <div style={{ marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      //                 <label style={{ fontWeight: "bold", }}>CPF ou CNPJ na nota: </label>
      //               </div>
      //               <div>
      //                 <div style={{ marginTop: 15, }}>
      //                   <Item>
      //                     <Input
      //                       value={this.state.notaFiscal}
      //                       onChangelabel={notaFiscal => this.setState({ notaFiscal })}
      //                     />
      //                   </Item>
      //                 </div>
      //               </div>
      //             </div>
      //           </div> : null}
      //         </div>

      //         <div style={{ width: '100%', alignItems: 'center' }}>
      //           <div style={{ width: '100%', marginTop: 15, paddingLeft: 15, paddingRight: 15 }}>
      //             <div style={{ marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

      //             </div>


      //             <div style={{ marginTop: 20, }}>
      //               <Button full success onPress={() => {
      //                 this.handlleEnviarPedido()
      //               }}>
      //                 <label>Finalizar pedido</label>
      //               </Button>
      //             </div>
      //           </div>
      //         </div>
      //       </Scrolldiv>
      //     </div>
      //   </div>
      // </Modal >
    );
  }

  onCancel() {
    this.TimePicker.close();
  }

  onConfirm(hour, minute) {
    this.setState({ time: `${hour}:${minute}`, obs: " Entregar as: " + `${hour}:${minute}` });
    this.TimePicker.close();
  }

  selectDate = (date) => {
    this.setState({ date: date });
  }
}

const mapStateToProps = state => ({
  carr: state.CarrinhoReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setCar, setCarEmp, setCurrentTab }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Carrinho);
