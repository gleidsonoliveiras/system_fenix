export default function Valid(state) {
  var valid = true;

  if (state.titulo === '') {
    valid = false;
  }

  if (state.end === '') {
    valid = false;
  }

  if (state.end === '') {
    valid = false;
  }

  if (state.numero === '') {
    valid = false;
  }

  if (state.bairro === '') {
    valid = false;
  }

  return valid;
}