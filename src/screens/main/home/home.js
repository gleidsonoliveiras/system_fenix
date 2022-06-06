import React, { Component } from 'react';
import api from './../../../utilites/api';
import Carousel from 'react-bootstrap/Carousel'
import ListCardapio from './../../../fragments/listCardapio'
import { setCar, setCarEmp, setCurrentTab } from './../../../redux/actions/';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Skeleton from '@material-ui/lab/Skeleton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import topo from './../../../assets/banner.png'
// import { Container } from './styles';

class Home extends Component {
  state = {
    isLoading: false,
    colorHeader: 'red',
    cardapio: [],
    cardapioOr: [],
    padrao: '1',
    images: [
      topo
      //require('./../../../../assets/banner.png'),
    ]
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    try {
      const response = await api.post('ws/ListGrupoProd.php');
      console.log('Testeee ', response.data)
      if (response.status === 200) {
        this.setState({
          cardapio: response.data,
          cardapioOr: response.data
        });
      } else {
        alert('Erro na comunicação com  servidor!', 'Atenção', false);
      }

    } catch (error) {
      alert('Erro na comunicação com servidor!', 'Atenção', false);
    }

    this.setState({ isLoading: false });


  }

  form() {
    return (
      <div>
        <img
          cclassName="d-block w-100"
          src={topo}
          alt="First slide"
          style={{width: "100%"}}
        />

        <div style={{ width: '100%', marginLeft: 10, marginTop: 0, marginRight: 15 }}>

          <div>
            <p style={{ fontSize: 23, fontWeight: "bold" }}>Cardápio</p>
          </div>
          
          <div style={{ marginTop: 0, width: '98%' }}>
            {this.state.isLoading ? this.formS() : this.List()}
          </div>


        </div>

      </div>
    );
  }

  getValorCarrinho() {
    var vl = 0.00;
    var adc = 0.00

    this.props.carr.carrinho.map(i => (
      vl = eval(parseFloat(vl) + parseFloat(i.preco))
    ))
    vl = vl;

    //var temp = vl.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

    return this.mascaraValor(vl.toFixed(2))
  }

  mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return valor
  }

  List() {
    return (
      <div style={{ marginTop: 0, width: '98%', display: this.state.padrao === '1' ? 'flex' : 'column', flexWrap: this.state.padrao === '1' ? 'wrap' : 'nowrap', justifyContent: 'space-between', marginBottom: 120 }}>
        {this.state.cardapio.map(i => (
          <ListCardapio Imagem={i.imagem} Nome={i.nome} padrao={this.state.padrao} acao={() => {
            this.props.history.push({
              pathname: '/Cardapio',
              state: {
                grupo: i.id,
                nome: i.nome
              }
            })
          }} />
        ))}
      </div>
    )
  }

  formS() {
    return (
      <div>
        <Skeleton variant="rect" height={50} style={{marginBottom: 15}}/>
        <Skeleton variant="rect" height={50} style={{marginBottom: 15}} />
        <Skeleton variant="rect" height={50} style={{marginBottom: 15}} />
        <Skeleton variant="rect" height={50}  style={{marginBottom: 15}}/>
        <Skeleton variant="rect" height={50} style={{marginBottom: 15}} />
      </div>

    );
  }

  header() {
    return (
      <div style={{ marginTop: 0, display: "flex", justifyContent: 'space-between', height: 60, paddingLeft: 0, paddingRight: 15, backgroundColor: this.state.colorHeader }}>
        <div style={{}}>
          <p style={{ fontSize: 28, fontWeight: "bold", marginLeft: 15, marginTop: 10, color: 'white' }}>Inicio</p>
        </div>

        <a style={{ marginTop: 0, display: "flex", justifyContent: 'space-between' }}
          onClick={() => {
            const { setCurrentTab } = this.props;
            setCurrentTab(1)
          }}
        >
          <ShoppingCartIcon style={{ color: '#fff', fontSize: 20, height: 60, }} />
          <i style={{ color: '#fff', marginLeft: 15, height: 20, paddingTop: 20 }}>R${this.getValorCarrinho()}</i>
        </a>
      </div>
    );
  }

  busc() {
    // return (
    //   <Item style={{ marginLeft: 0, marginRight: 30, justifyContent: 'space-between', flexDirection: 'row', }} >
    //     <Input
    //       placeholder="Busca"
    //       value={this.state.consulta}
    //       returnKeyType='search'
    //       onChangeText={consulta => this.setState({ consulta })}
    //       onSubmitEditing={this.handlePresquisa}
    //     />
    //     <Button transparent light style={{ marginRight: 0, marginTop: 5, }} ref='wv1' onPress={this.handlePresquisa}>
    //       <Icon style={{ color: 'black' }} name="search" />
    //     </Button>
    //   </Item>
    // )
  }

  handlePresquisa = async () => {
    var temp = this.state.cardapioOr;

    let result = temp.filter((item) => { return item.nome.match(this.state.consulta) });
    this.setState({ cardapio: result });
  }

  render() {
    return (
      <div>
        {/* Cabeçario */
          this.header()
        }

        {/* Corpo */}
        {this.form()}
      </div>
    );
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
)(Home);
