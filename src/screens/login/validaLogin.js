export default function Valid(state) {
  var valid = true;

  if (state.telefone === '') {
      valid = false;
  }

  return valid;
}