import React, { Component } from 'react';
import { setProdSelc, delProdSelc, setCurrentTab } from './../../redux/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import api from './../../utilites/api';
import ListProdutos from './../../fragments/listProdutos'
import Skeleton from '@material-ui/lab/Skeleton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';


// import { Container } from './styles';

class Cardapio extends Component {
  state = {
    produtos: [],
    produtosOr: [],
    isLoading: false,
    colorHeader: 'red',
    consulta: ''
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const data = new FormData();
    data.append('id_grupo', this.props.location.state.grupo);

    try {
      const response = await api.post('ws/ListProd.php', data);
      console.log('respostaPR: ', response.data)
      if (response.status === 200) {
        this.setState({
          produtos: response.data,
          produtosOr: response.data,
        });
      } else {
        alert('Erro na comunicação com  servidor!', 'Atenção', false);
      }

    } catch (error) {
      alert('Erro na comunicação com servidor!', 'Atenção', false);
    }

    this.setState({ isLoading: false });
  }

  listProd() {
    const { delProdSelc,  setProdSelc} = this.props;
    return (
      <div>
        {this.state.produtos.map(i => (
          <ListProdutos Imagem={i.imagem} Nome={i.nome} Obs={i.obs} Preco={i.preco} acao={() => {
            delProdSelc();
            setProdSelc(i);
            this.props.history.push({
              pathname: '/Produto',
              state: {
                pp: i
              }
            })
          }} />
        ))}
        <div style={{width: 20, height: 80}}></div>
      </div>
    )
  }

  formS() {
    return (
      <div>
        <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
        <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
        <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
        <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
        <Skeleton variant="rect" height={50} style={{ marginBottom: 15 }} />
      </div>
    )
  }

  getValorCarrinho() {
    var vl = 0.00;
    var adc = 0.00

    this.props.carr.carrinho.map(i => (
      vl = eval(parseFloat(vl) + parseFloat(i.preco))
    ))
    vl = vl;


    return this.mascaraValor(vl.toFixed(2))
  }

  mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return valor
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
            <label style={{ fontSize: 28, fontWeight: "bold", color: '#fff' }}>Cardápio</label>
          </div>
        </div>
      </div>
    );
  }

  pesquisaP() {
    var temp = this.state.produtosOr;

    let result = temp.filter((item) => { return item.nome.match(this.state.consulta) });
    this.setState({ produtos: result });
  }

  handlePresquisa = async () => {
    var temp = this.state.produtosOr;

    let result = temp.filter((item) => { return item.nome.toLowerCase().match(this.state.consulta.toLowerCase()) });
    this.setState({ produtos: result });
  }

  render() {
    return (
      <div>
        <div style={{flex: 1}}>
          {this.header()}
          <div style={{ marginTop: 15 }}>
            <label style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15, marginTop: 25 }}>{this.props.location.state.nome}</label>
          </div>
          <div style={{ marginLeft: 0, marginTop: 5 }}>
            {this.state.isLoading ? this.formS() : this.listProd()}
          </div>
        </div>

        {Object.entries(this.props.carr.carrinho).length > 0 ?
          <div style={{
            backgroundColor: 'green',
            position: "absolute",
            justifyContent: 'space-between',
            bottom: 0,
            display: 'flex',
            left: 0,
            paddingTop: 15,
            height: 40, width: '100%',
            position:"fixed",
            bottom:"0px"
          }}>
            <a style={{ width: '100%', marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between' }} onClick={
              () => {
                const { setCurrentTab } = this.props;
                setCurrentTab(1);
                this.props.history.goBack()
              }
            }>
              <label style={{ color: '#fff', marginTop: 15, fontSize: 12 }}>Valor parcial: R$ {this.getValorCarrinho()}</label>

            </a>              
            <a style={{ marginRight: 20, width: 200}} onClick={
              () => {
                const { setCurrentTab } = this.props;
                setCurrentTab(1);
                this.props.history.goBack()
              }
            }>
              <ShoppingCartIcon name='cart' style={{ color: 'white', fontSize: 12, marginRight: 5 }} />
              <label style={{ color: 'white', fontSize: 12 }}>Finalizar Pedido</label>
            </a>
          </div> : null
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  preodSelc: state.SelecReducer,
  carr: state.CarrinhoReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setProdSelc, delProdSelc, setCurrentTab }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cardapio);
