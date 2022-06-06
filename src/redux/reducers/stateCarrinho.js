const state = {
  carrinho: [],
  empresaCarrinho: '0'
};

export const CarrinhoReducer = (stateAtual = state, action) => {
  switch (action.type) {
    case 'UPDATE_CAR':
      var listTemp = stateAtual.carrinho;
      listTemp.push(action.produto);
      return {
        ...stateAtual,
        carrinho: listTemp
      };
    case 'GET_CAR':
      return {
        ...state
      };
    case 'SET_CAR_EMP':
      var listTemp = stateAtual.carrinho;
      listTemp = [];
      return {
        ...stateAtual,
          carrinho: [],
          empresaCarrinho: '0'
      };
    case 'DEL_ITEM_CAR':
      var listTemp = stateAtual.carrinho;
      listTemp.splice(action.x, 1);
      if (listTemp.length === 0) {
        return {
          ...stateAtual,
          carrinho: [],
          empresaCarrinho: '0'
        };
      } else {
        return {
          ...stateAtual,
          carrinho: listTemp
        };
      }
    default:
      return stateAtual;
  }
};