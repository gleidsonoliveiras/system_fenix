const state = {
  produto: {}
};

export const SelecReducer = (stateAtual = state, action) => {
  switch (action.type) {
    case 'SET_SELC':
      return {
        produto: action.produto
      };
    case 'DEL_SELC':
      return {
        produto: ''
      };
    default:
      return {};
  }
};