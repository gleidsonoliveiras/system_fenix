const state = {
  currentTab: 0
};

export const CurrentTabReducer = (stateAt = state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_TAB':
      return {
        ...stateAt,
        currentTab: action.tab
      };
    default:
      return stateAt;
  }
};