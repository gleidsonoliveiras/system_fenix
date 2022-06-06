import React, { Component } from 'react';
import { setDelCar } from './../redux/actions/'
import { bindActionCreators } from 'redux';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';

class ListCarrinho extends Component {
  render() {
    return (
      <div style={{ marginLeft: 0 }} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ marginLeft: 0, paddingTop: 0, width: '80%' }}>
          <div style={{ width: '100%', }} >
            <label numberOfLines={1}>{this.props.qtd}x {this.props.nome}</label>
          </div>
          <div style={{ width: '100%', }} >
            <label style={{ width: '100%', fontSize: 12, }} numberOfLines={3}>{this.props.adcionais}</label>
          </div>
          <label style={{ fontSize: 12, marginTop: 1, width: '100%' }} numberOfLines={1}>
          </label>
          <label style={{ fontSize: 14, marginTop: 1, width: '100%', fontWeight: 'bold' }} numberOfLines={1}>R$ {this.mascaraValor(eval(parseFloat(this.props.preco)).toFixed(2))}</label>
        </div>
        <a style={{ height: 60, width: '10%', alignItems: 'flex-end', marginRight: 0 }}
          onClick={() => {

            const {
              setDelCar
            } = this.props;
            console.log('car1', this.props.pos)
            setDelCar(this.props.pos);
            //console.log('car', this.props.carrinho)



          }}>
          <DeleteIcon style={{ marginTop: 10, marginRight: -5, fontSize: 22, color: 'red' }} />
        </a>

      </div>
    );
  }

  mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return valor
  }
}

const mapStateToProps = state => ({
  carr: state.CarrinhoReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setDelCar }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCarrinho);
