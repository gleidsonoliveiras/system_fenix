const state = {
  pedidoA: 0
};

export const PedidoAReducer = (stateAt = state, action) => {
  switch (action.type) {
    case 'SET_PEDIDO_A':
      return {
        ...stateAt,
        pedidoA: action.pedidoA
      };
    default:
      return stateAt;
  }
};