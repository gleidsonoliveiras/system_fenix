export const setCar = value => ({
  type: 'UPDATE_CAR',
  produto: value
});

export const getCar = value => ({
  type: 'GET_CAR',
  carrinho: value
});

export const setCarEmp = value => ({
  type: 'SET_CAR_EMP',
  empresa: value
});

export const setDelCar = value => ({
  type: 'DEL_ITEM_CAR',
  x: value
});

export const setCurrentTab = value => ({
  type: 'SET_CURRENT_TAB',
  tab: value
});

export const setPedidoA = value => ({
  type: 'SET_PEDIDO_A',
  pedidoA: value
});

export const setProdSelc = value => ({
  type: 'SET_SELC',
  produto: value
});

export const delProdSelc = value => ({
  type: 'DEL_SELC',
  produto: value
})