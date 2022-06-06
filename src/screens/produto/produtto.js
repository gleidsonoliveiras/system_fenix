import React, { Component } from 'react';
import VariaveisGlobais from './../../utilites/variaveisDoSistema';
import Carregando from './../../fragments/carregando2'
import api from './../../utilites/api';
import { bindActionCreators } from 'redux';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { setProdSelc, delProdSelc, setCar } from './../../redux/actions';
import { connect } from 'react-redux';
import Montagem from './../../fragments/motagem'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';

// import { Container } from './styles';

class Produto extends Component {

  state = {
    adc: [],
    quant: 1,
    obs: '',
    isLoading: false,
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { setProdSelc, delProdSelc } = this.props;
    console.log('ProdSEnter: ', this.props.preodSelc.produto)
    delProdSelc();

    const data = new FormData();
    data.append('produto', this.props.location.state.pp.id);

    try {
      const response = await api.post('ws/ListMontagem.php', data);
      console.log('resposta: ', response.data)
      if (response.status === 200) {
        if (response.status !== '[]') {
          this.setState({
            adc: response.data
          });
        }
        //console.log('sdf ss', this.state.adc[0].itens)
      } else {
        alert('Erro na comunicação com  servidor!', 'Atenção', false);

      }

    } catch (error) {
      console.log('sdf ss', error)
      alert('Erro na comunicação com servidor!!', 'Atenção', false);
    }
    var u = this.props.location.state.pp;
    u = { ...u, precoUn: u.preco, precoAdc: 0, zero: 0, um: 0, dois: 0, tres: 0, quatro: 0, cinco: 0, seis: 0, sete: 0 };

    setProdSelc(u);
    this.setState({ isLoading: false });

  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return valor
  }

  form() {
    const vglobais = new VariaveisGlobais();
    return (
      <div>
        <div>
          <div
            style={{
              marginTop: 0,
              width: '100%',
              height: 180,
              backgroundColor: '#d8dadc',
              position: 'relative',
            }}>

            <img
              cclassName="d-block w-100"
              src={vglobais.getHostIMG + '/pod/' + this.props.location.state.pp.imagem}
              alt="First slide"
              style={{
                marginTop: 0,
                width: '100%',
                height: 180,
                backgroundColor: '#d8dadc',
                objectFit: 'cover',
                position: 'relative',
              }}
            />
          </div>
          <a style={{ position: 'relative', marginLeft: 15, marginTop: 15, height: 48, width: 48, flexDirection: 'row', alignItems: 'center' }} onPress={() => {
            this.props.navigation.goBack()
          }}>
            <a style={{ height: 48, width: 30, flexDirection: 'row', alignItems: 'center', marginTop: 4 }} onPress={() => {
              this.props.location.goBack()
            }}>
              <ArrowBackIcon style={{ color: '#fff' }} />
            </a>
          </a>
          <div>
            <label style={{ fontSize: 15, fontWeight: "bold", marginLeft: 15, marginTop: 15 }}>{this.props.location.state.pp.nome}</label>
          </div>
          <div style={{ marginLeft: 15, marginTop: 10 }}>
            <label style={{ fontSize: 13, }}>{this.props.location.state.pp.obs}</label>
          </div>
          <div style={{ marginLeft: 15, width: '98%', marginTop: 10, }}>
            <label style={{ fontSize: 15, fontWeight: "bold", width: '97%', textAlign: 'right' }}>R$ {this.mascaraValor(eval(parseFloat(this.props.preodSelc.produto.preco)).toFixed(2))}</label>
          </div>
        </div>
        <div>
          <div style={{ marginLeft: 15, marginTop: 10, }}>
            {this.state.adc.map((i, key) => (
              <Montagem Iten={i} Key={key+1}/>
            ))}
          </div>
          <div style={{ marginLeft: 15, marginTop: 5, width: '98%', marginTop: 10 }}>
            <label style={{ fontSize: 15, fontWeight: "bold" }}>
              Quantidade
            </label>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 15, justifyContent: 'space-between', marginRight: 30 }}>
              <a onClick={this.minuss}>
                <RemoveIcon />
              </a>
              <a style={{ fontSize: 20, fontWeight: "bold" }}>
                {this.state.quant}
              </a>
              <a onClick={this.pluss}>
                <AddIcon />
              </a>
            </div>
          </div>
          <div style={{ marginLeft: 15, marginTop: 15, marginRight: 17 }}>
            <InputLabel htmlFor="input-with-icon-adornment">Observação</InputLabel>
            <Input
              value={this.state.obs}
              useNativeDriver={true}
              name="obs"
              style={{ width: '100%' }}
              onChange={this.handleChange}
            />
          </div>
          {/* <a style={{ marginLeft: 15, marginTop: 25, backgroundColor: 'green', width: '100%', }} onPress={() => {
            this.setState({ isLoading: true });
            const { setCar, setProdSelc } = this.props;

            var listTemp = this.props.preodSelc.produto;
            var pTemp = parseFloat(this.props.preodSelc.produto.preco) * parseFloat(this.state.quant)
            listTemp = { ...listTemp, preco: pTemp, quant: this.state.quant, observacao: this.state.obs }
            //setProdSelc(listTemp);

            var tt = listTemp;
            setCar(tt);

            console.log('ProdSelc: ', this.props.carrinho);
            this.props.navigation.goBack()
          }}>
            <label>Adcionar ao carrinho</label>
          </a> */}
          <Button variant="contained" color="primary" style={{
            marginLeft: 10, marginRight: 20,
            marginTop: 20,
            width: '93%'
          }}
            onClick={() => {
              this.setState({ isLoading: true });
              const { setCar, setProdSelc } = this.props;

              var listTemp = this.props.preodSelc.produto;
              var pTemp = parseFloat(this.props.preodSelc.produto.preco) * parseFloat(this.state.quant)
              listTemp = { ...listTemp, preco: pTemp, quant: this.state.quant, observacao: this.state.obs }
              //setProdSelc(listTemp);

              var tt = listTemp;
              setCar(tt);

              console.log('ProdSelc: ', this.props.carrinho);
              this.props.history.goBack()
            }} >
            Adcionar ao carrinho
        </Button>
          <div style={{ width: 10, height: 80 }} />
        </div>
      </div>
    );
  }

  pluss = () => {

    this.setState({
      quant: this.state.quant + 1
    });

  }

  minuss = () => {
    if (this.state.quant > 1) {
      this.setState({
        quant: this.state.quant - 1
      });
    }

  }

  render() {
    return (
      this.state.isLoading ? <Carregando /> : this.form()
    );
  }
}

const mapStateToProps = state => ({
  preodSelc: state.SelecReducer,
  carrinho: state.CarrinhoReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setProdSelc, delProdSelc, setCar }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Produto);
