import React, { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import Splash from './screens/splash/splash'
import Login from './screens/login/login'
import Main from './screens/main/main'
import Inicial from './screens/inicial/inicial'
import Cardapio from './screens/cardapio/cardapio'
import Produto from './screens/produto/produtto'
import Endereco from './screens/endereco/endereco'
import CadEndereco from './screens/endereco/cadEndereco'
import Pedidos from './screens/pedidos/pedidos'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getCar } from './redux/actions/';

class Routes extends Component {

  async componentDidMount() {
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Splash} />
          <Route path="/Login" exact component={Login} />
          <Route path="/Home" exact component={Inicial} />
          <Route path="/Main" exact component={Main} />
          <Route path="/Cardapio" exact component={Cardapio} />
          <Route path="/Produto" exact component={Produto} />
          <Route path="/Endereco" exact component={Endereco} />
          <Route path="/CadEndereco" exact component={CadEndereco} />
          <Route path="/Pedidos" exact component={Pedidos} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = store => ({
  carrinho: store.CarrinhoReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getCar }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes);
