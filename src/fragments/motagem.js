import React, { Component } from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { setProdSelc } from './../redux/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Montagem extends Component {

  state = {
    sel: "true",
    qtd: 0,
    qtdSel: 0,
    select: [],
    prod: {}
  }

  selecionados = {

  }

  sec = [];

  constructor(props) {
    super(props);
    var obb = Object.entries(this.props.Iten.itens);

    for (var j = 0; j < obb.length; j++) {
      this.selecionar(obb[j][1].id, false)
    }
  }

  async componentDidMount() {
    var listTemp = this.props.preodSelc.produto;
    var list = this.props.preodSelc.produto[this.props.Iten.nome];
    list.splice(0, list.length)
    listTemp = { ...listTemp, [this.props.Iten.nome]: list }
    setProdSelc(listTemp);

    this.props.Iten.itens.map((i, ix) => (
      this.props.Iten.obriga === 'Sim' && ix === 0 ? this.marcarPrimeiro(i) : null
    ));
  }

  selecionar(title, filter) {
    if (this.selecionados[title] !== undefined) { // Testa se a chave existe
      this.state[title].push(filter);    // Adiciona um elemento no array
    } else {
      this.state[title] = filter;      // Se não existe, cria um array com um elemento
    }
  }


  render() {
    return (
      <div style={{ marginBottom: 20 }} >
        <div style={{ width: '100%' }}>
          <label style={{ fontSize: 15, fontWeight: "bold", width: '100%' }}>
            {this.props.Iten.nome} {this.props.Iten.obriga === 'Sim' ? '*' : null}
          </label>
        </div>

        {this.props.Iten.quantidade > 1 ?
          <label style={{ fontSize: 11, marginBottom: 5 }}>
            Selecione até {this.props.Iten.quantidade} opções
          </label> :
          <label style={{ fontSize: 11, marginBottom: 5 }}>
            Selecione apenas 1 opção
          </label>}
        {this.props.Iten.itens.map((i, ix) => (
          <div style={{ marginLeft: 1, marginRight: 20, marginTop: 5, display: 'flex',  backgroundColor: this.state[i.id] ? '#e4e4e4' : "#fff"}} 
          onClick={async () => {

            if (this.state[i.id]) {
              if (this.props.Iten.obriga === 'Sim' && this.sec.length === 1) { console.log("aqui") }
              else {
                const { setProdSelc } = this.props;
                var listTemp = this.props.preodSelc.produto;
                var listTemp2 = this.props.preodSelc.produto[this.props.Iten.nome];

 
                listTemp2 = listTemp2.filter((element) => element != i.nome)
         

                this.sec = this.removerPorId2(this.sec, i.id);          

                var pTemp = parseFloat(listTemp.preco) - parseFloat(i.preco)
                listTemp = { ...listTemp, preco: pTemp}
                setProdSelc(listTemp);

                listTemp = { ...listTemp, [this.props.Iten.nome]: listTemp2 }
                this.props.preodSelc.produto = listTemp
                setProdSelc(listTemp);

                this.setState({ [i.id]: !this.state[i.id], qtd: this.state.qtd - 1, qtdSel: this.state.qtdSel - 1 })

                //this.getValorMenos();
              }
              this.getValor();
            } else {
              if (this.state.qtd < this.props.Iten.quantidade) {

                const { setProdSelc } = this.props;
                var listTemp = this.props.preodSelc.produto;
                var listTemp2 = this.props.preodSelc.produto[this.props.Iten.nome];
                listTemp2.push(i.nome);
                var pTemp = parseFloat(listTemp.preco) + parseFloat(i.preco)
                listTemp = { ...listTemp, preco: pTemp }
                //setProdSelc(listTemp);

                this.sec.push(i);

                listTemp = { ...listTemp, [this.props.Iten.nome]: listTemp2 }
                this.setState({ [i.id]: !this.state[i.id], qtd: this.state.qtd + 1, qtdSel: this.state.qtdSel + 1 });
                this.getValor();
              } else {
                if (this.props.Iten.obriga === 'Sim' && this.props.Iten.quantidade === "1") {
                  this.props.Iten.itens.map((j, ix) => (
                    this.desmarcarAll(j)
                  ));
                  const delay = ms => new Promise(res => setTimeout(res, ms));

                  await delay(8);
                  this.marcar(i)
                } else if (this.props.Iten.obriga === 'Sim' && this.props.Iten.quantidade !== "1") {
                  const delay = ms => new Promise(res => setTimeout(res, ms));

                  //await delay(8);
                  //this.marcar(i)
                }




              }

            }

          }}>
            <div style={{ width: '90%',  }}>
              <div>
                <div>
                  <label style={{ fontSize: 13, width: '100%' }}>{i.nome.split("@")[1]} - R$ {this.mascaraValor(eval(parseFloat(i.preco)).toFixed(2))}</label>
                </div>
                <label style={{ fontSize: 10, width: '100%' }}>{i.obs}</label>
              </div>
            </div>
            <div style={{ marginRight: 0, width: '10%' }}>
              {this.state[i.id] ?
                <CheckCircleOutlineIcon style={{ fontSize: 13, color: 'green' }} />
                : null}
            </div>
            {}
          </div>
        ))}

      </div>
    )
  }

  async marcarPrimeiro(i) {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    await delay(8);
    this.marcar(i)
    // if (this.state[i.id]) { }
    // else {

    //   const { setProdSelc } = this.props;
    //   var listTemp = this.props.preodSelc.produto;
    //   var listTemp2 = this.props.preodSelc.produto[this.props.Iten.nome];
    //   listTemp2.push(i.nome);
    //   var pTemp = parseFloat(listTemp.preco)
    //   listTemp = { ...listTemp, preco: pTemp }
    //   //setProdSelc(listTemp);

    //   this.sec.push(i);

    //   listTemp = { ...listTemp, [this.props.Iten.nome]: listTemp2 }
    //   //setProdSelc(listTemp);

    //   this.setState({ [i.id]: !this.state[i.id], qtd: this.state.qtd + 1, qtdSel: this.state.qtdSel + 1 });
    //   //this.getValor();

    //   var PrecoTT = 0;
    //   var PrecoMM = 0;
    //   var PrecoMD = 0;
    //   var Qtd = 0;

    //   for (var i = 0; i < Object.entries(this.sec).length; i++) {
    //     PrecoTT = PrecoTT + parseFloat(this.sec[i].preco);
    //     Qtd = Qtd + 1;
    //     if (this.sec[i].preco > PrecoMM) {
    //       PrecoMM = this.sec[i].preco;
    //     }
    //     console.log('Valor: ', this.sec[i].preco)
    //   }

    //   PrecoMD = PrecoTT / Qtd;

    //   PrecoMD = (PrecoMD).toFixed(2);

    //   if (this.props.Iten.tipoPreco == 'Maior') {
    //     console.log('Maior')
    //     var pTemp = parseFloat(listTemp.preco) + parseFloat(PrecoMM);
    //     listTemp = { ...listTemp, preco: pTemp }
    //     setProdSelc(listTemp);
    //   } else if (this.props.Iten.tipoPreco == 'Divisão') {
    //     console.log('Divisão')
    //     var pTemp = parseFloat(listTemp.preco) + parseFloat(PrecoMD);
    //     listTemp = { ...listTemp, preco: pTemp }
    //     setProdSelc(listTemp);
    //   } else {
    //     console.log('Normal')        
    //     var pTemp = parseFloat(listTemp.preco) + parseFloat(PrecoTT);
    //     console.log('preco1', PrecoTT)
    //     console.log('preco2', listTemp.preco)
    //     console.log('resilt', pTemp)

    //     listTemp = { ...listTemp, preco: pTemp }

    //     setProdSelc(listTemp);
    //   }
    // }

  }

  desmarcarAll(i) {
    if (this.state[i.id]) {
      const { setProdSelc } = this.props;
      var listTemp = this.props.preodSelc.produto;
      var listTemp2 = this.props.preodSelc.produto[this.props.Iten.nome];

      listTemp2.splice(i.nome, 1);

      this.sec = this.removerPorId2(this.sec, i.id);

      var pTemp = parseFloat(listTemp.preco) - parseFloat(i.preco)
      listTemp = { ...listTemp, preco: pTemp }
      //setProdSelc(listTemp);

      listTemp = { ...listTemp, [this.props.Iten.nome]: listTemp2 }
      //setProdSelc(listTemp);

      this.setState({ [i.id]: false, qtd: this.state.qtd - 1, qtdSel: 0 })
      //this.getValor();

      var PrecoTT = 0;
      var PrecoMM = 0;
      var PrecoMD = 0;
      var Qtd = 0;

      for (var i = 0; i < Object.entries(this.sec).length; i++) {
        PrecoTT = PrecoTT + parseFloat(this.sec[i].preco);
        Qtd = Qtd + 1;
        if (this.sec[i].preco > PrecoMM) {
          PrecoMM = this.sec[i].preco;
        }
        console.log('Valor: ', this.sec[i].preco)
      }

      PrecoMD = PrecoTT / Qtd;

      PrecoMD = (PrecoMD).toFixed(2);

      //var listTemp = this.props.preodSelc.produto;


      if (this.props.Iten.tipoPreco == 'Maior') {
        var pTemp = parseFloat(listTemp.preco) - parseFloat(PrecoMM);
        listTemp = { ...listTemp, preco: pTemp }
        setProdSelc(listTemp);
      } else if (this.props.Iten.tipoPreco == 'Divisão') {
        console.log('Divisão')
        var pTemp = parseFloat(listTemp.preco) - parseFloat(PrecoMD);
        listTemp = { ...listTemp, preco: pTemp }
        setProdSelc(listTemp);
      } else {
        var pTemp = parseFloat(listTemp.preco) - parseFloat(PrecoTT);
        console.log('Normal, preco: ', pTemp)
        listTemp = { ...listTemp, preco: pTemp }
        setProdSelc(listTemp);
      }
    }

  }

  marcar(i) {
    if (this.state[i.id]) { }
    else {
      const { setProdSelc } = this.props;
      var listTemp = this.props.preodSelc.produto;
      var listTemp2 = this.props.preodSelc.produto[this.props.Iten.nome];
      listTemp2.push(i.nome);
      var pTemp = parseFloat(listTemp.preco) + parseFloat(i.preco)


      listTemp = { ...listTemp, preco: pTemp }
      //setProdSelc(listTemp);

      console.log('item inserido',i)
      this.sec.push(i);

      listTemp = { ...listTemp, [this.props.Iten.nome]: listTemp2 }
      console.log('lista após inserir',listTemp)
      //setProdSelc(listTemp);

      this.setState({ [i.id]: !this.state[i.id], qtd: this.state.qtd + 1, qtdSel: this.state.qtdSel + 1 });
      this.getValor();
    }
  }

  mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g, "");
    valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
    return valor
  }


  async getValor() {
    var PrecoTT = 0;
    var PrecoMM = 0;
    var PrecoMD = 0;
    var Qtd = 0;

    for (var i = 0; i < Object.entries(this.sec).length; i++) {
      PrecoTT = PrecoTT + parseFloat(this.sec[i].preco);
      Qtd = Qtd + 1;
      if (this.sec[i].preco > PrecoMM) {
        PrecoMM = parseFloat(this.sec[i].preco);
      }
      console.log('Valor: ', this.sec[i].preco)
      console.log('Valor2: ', this.props.preodSelc.produto.preco)
    }

    PrecoMD = PrecoTT / Qtd;

    PrecoMD = (PrecoMD).toFixed(2);
    const { setProdSelc } = this.props;
    var listTemp = this.props.preodSelc.produto;
    if (this.props.Iten.tipoPreco == 'Maior') {
      var pTemp = parseFloat(listTemp.precoUn) + this.getVlList(this.props.Key) + PrecoMM;
      listTemp = { ...listTemp, preco: pTemp, [this.getNome(this.props.Key)]: PrecoMM }
      await setProdSelc(listTemp);
    } else if (this.props.Iten.tipoPreco == 'Divisão') {
      var pTemp = parseFloat(listTemp.precoUn) + this.getVlList(this.props.Key) + PrecoMD;
      listTemp = { ...listTemp, preco: pTemp, [this.getNome(this.props.Key)]: PrecoMD }
      setProdSelc(listTemp);
    } else {
      var pTemp = parseFloat(listTemp.precoUn) + this.getVlList(this.props.Key) + PrecoTT;
      //var pTemp = parseFloat(listTemp.precoUn) + parseFloat(PrecoTT);
      //listTemp = { ...listTemp, preco: pTemp }
      listTemp = { ...listTemp, preco: pTemp, [this.getNome(this.props.Key)]: PrecoTT }
      setProdSelc(listTemp);
    }


  }

  getVlList(list) {
    var Exit = 0;
    console.log("sele", this.props.preodSelc.produto)

    if(this.props.Key !== 0) {
      Exit = Exit + this.props.preodSelc.produto.zero;
    }

    if(this.props.Key !== 1) {
      Exit = Exit + this.props.preodSelc.produto.um;
    }

    if(this.props.Key !== 2) {
      Exit = Exit + this.props.preodSelc.produto.dois;
    }

    if(this.props.Key === 3) {
      Exit = Exit + this.props.preodSelc.produto.tres;
    }

    if(this.props.Key === 4) {
      Exit = Exit + this.props.preodSelc.produto.quatro;
    }

    if(this.props.Key === 5) {
      Exit = Exit + this.props.preodSelc.produto.cinco;

    }

    if(this.props.Key === 6) {
      Exit = Exit + this.props.preodSelc.produto.seis;
    }
    

    return Exit;

  }

  getNome(num) {
    var Exit = "zero"

    if(num === 1){
      Exit = "um"
    }

    if(num === 2){
      Exit = "dois"
    }

    if(num === 3){
      Exit = "tres"
    }

    if(num === 4){
      Exit = "quatro"
    }

    if(num === 5){
      Exit = "cinco"
    }

    if(num === 6){
      Exit = "seis"
    }

    if(num === 7){
      Exit = "sete"
    }

    return Exit
  }

  getValorMenos() {
    var PrecoTT = 0;
    var PrecoMM = 0;
    var PrecoMD = 0;
    var Qtd = 0;

    for (var i = 0; i < Object.entries(this.sec).length; i++) {
      PrecoTT = PrecoTT + parseFloat(this.sec[i].preco);
      Qtd = Qtd + 1;
      if (this.sec[i].preco > PrecoMM) {
        PrecoMM = this.sec[i].preco;
      }
      console.log('Valor: ', this.sec[i].preco)
    }

    PrecoMD = PrecoTT / Qtd;

    PrecoMD = (PrecoMD).toFixed(2);
    const { setProdSelc } = this.props;
    var listTemp = this.props.preodSelc.produto;

    if (this.props.Iten.tipoPreco == 'Maior') {
      console.log('Maior-')
      var pTemp = parseFloat(PrecoMM);
      listTemp = { ...listTemp, preco: pTemp }
      setProdSelc(listTemp);
    } else if (this.props.Iten.tipoPreco == 'Divisão') {
      console.log('Divisão')
      var pTemp = parseFloat(listTemp.preco) - parseFloat(PrecoMD);
      listTemp = { ...listTemp, preco: pTemp }
      setProdSelc(listTemp);
    } else {
      console.log('Normal')
      var pTemp = parseFloat(listTemp.preco) - parseFloat(PrecoTT);
      listTemp = { ...listTemp, preco: pTemp }
      setProdSelc(listTemp);
    }


  }

  removerPorId2(array, id) {
    return array.filter(function (el) {
      return el.id !== id;
    });
  }

  QuantSel(array) {
    var e = 0;
    array.filter(function (el) {
      console('czxcz', el)
    });
  }
}

const mapStateToProps = state => ({
  preodSelc: state.SelecReducer
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setProdSelc }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Montagem);
