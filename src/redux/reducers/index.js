import { CarrinhoReducer } from './stateCarrinho';
import { SelecReducer } from './stateSelec';
import { PedidoAReducer } from './statePedidoA';
import { CurrentTabReducer } from './stateTabs'
import { combineReducers } from 'redux';






export const Reducers = combineReducers({
  CarrinhoReducer: CarrinhoReducer,
  CurrentTabReducer: CurrentTabReducer,
  SelecReducer: SelecReducer,
  PedidoAReducer: PedidoAReducer
});