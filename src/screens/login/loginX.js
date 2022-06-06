import React, { Component } from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Carregando from './../../fragments/carregando';
import Valid from './validaLogin';
import api, { apiSMS } from './../../utilites/api';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// import { Container } from './styles';

export default class Login extends Component {

  state = {
    telefone: '',
    codigo: '',
    isLogin: true,
    isLoading: false,
    isCodigo: false,
    validador: '',
    mdCadastro: false,

    telefoneCadastro: '',
    nomeCadastro: '',
    cpfCadastro: '',
    open: false,

  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChange2 = e => {
    var ste = e.target.value.replace(/[^0-9]/g,'');
    this.setState({ [e.target.name]: ste });
  };

  async componentDidMount() {
    this.setState({ validador: Math.floor(Math.random() * (999999 - 100000 + 1) + 100000) + '' });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  ValidaTelefone = async () => {

    if (Valid(this.state)) {

      this.setState({ open: true })

    } else {
      alert('Informa seu numero de telefone', 'Atenção', false);
      this.setState({ isLoading: false, isLogin: true });
    }


  }

  VerificarCadastro = async () => {
    if (this.state.codigo === this.state.validador) {
      this.setState({ isLoading: true, isLogin: false, isCodigo: false });
      const data = new FormData();
      data.append('numero', this.state.telefone);
      data.append('acao', 'consulta');
      const response = await api.post('ws/CadastrarUsuario.php', data);
      if (response.status === 200) {
        console.log('Resposta: ', response.data)
        if (response.data.Descricao === 'Usuario Nao Cadastrado') {
          this.setState({ isLoading: false, isLogin: true, mdCadastro: true });
        } else {

          localStorage.setItem('@webApp/username', response.data.Nome);
          localStorage.setItem('@webApp/userid', response.data.id);
          localStorage.setItem('@webApp/usertelefone', response.data.Telefone);
          localStorage.setItem('@webApp/usercpf', response.data.CPF);
          localStorage.setItem('@webApp/userdtnsc', response.data.Dt_Nsc);

          this.props.history.push({
            pathname: '/',
            state: {
              servico: response.data.Codigo,
            }
          })

        }
      } else {
        alert('Erro na comunicação com servidor!', 'Atenção', false);
        this.setState({ isLoading: false, isLogin: true });
      }
    } else {
      alert('Código de validação incorreto', 'Atenção', false);
    }
  }

  inicial() {
    return (
      <div style={{ background: '#fff' }}>

        {/* Header */}

        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            
              <h3>FENIX</h3>
            
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                
              </ul>
            </div>
          </div>
        </nav>


        <div className="auth-wrapper">
          <div className="auth-inner">
          
          <form>
        <h3>Sign In</h3>



        <div className="mb-3">
          <p style={{ fontSize: 28, fontWeight: "bold", marginLeft: 15, marginTop: 15 }}>Login</p>
        </div>

        <div style={{ marginTop: '25%', marginLeft: 15, marginRight: 15 }}>
          <p style={{ textAlign: 'justify' }}>

            Insira o numero do seu telefone com DDD para realizar o login, caso seja seu promeiro acesso você irá preencher um formulário de inscrisão.
          </p>
        </div>

        <div style={{ marginLeft: 15, marginRight: 15, marginTop: 25 }}>
          <InputLabel htmlFor="input-with-icon-adornment">Telefone (Só numeros)</InputLabel>
          <Input
            keyboardType='numeric'
            value={this.state.telefone}
            useNativeDriver={true}
            disabled={this.state.isCodigo}
            style={{ width: "98%" }}
            name="telefone"
            onChange={this.handleChange2}
          />
        </div>

        </form>



          </div>
        
        </div>



        

        {this.state.isCodigo ?
          <div style={{ marginLeft: 15, marginRight: 15, marginTop: 25 }}>
            <InputLabel htmlFor="input-with-icon-adornment">Digite o código: {this.state.validador} no campo abaixo</InputLabel>
            <Input
              value={this.state.codigo}
              useNativeDriver={true}
              autoFocus={true}
              style={{ width: "98%" }}
              name="codigo"
              onChange={this.handleChange}
            />
          </div> :
          null
        }

        <div style={{ marginLeft: 15, marginRight: 15, marginTop: 25 }}>
          <Button variant="contained" color="primary" style={{ width: '98%' }}
            onClick={this.state.isCodigo ? this.VerificarCadastro : this.ValidaTelefone}>
            Continuar
          </Button>
        </div>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Verificação"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {"Verifique se eu numero está correto: " + this.state.telefone}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
          </Button>
            <Button onClick={async () => {
              this.setState({ isLoading: true, isLogin: false });
              const data = new FormData();
              data.append('numero', this.state.telefone);
              data.append('codigo', this.state.validador);
              console.log('Codigo gerado: ', this.state.validador)
              const response = await apiSMS.post('ws/ValidarTelefone.php', data);
              if (response.status === 200) {
                console.log('Resposta: ', response.data.codigo)
                if (true) {
                  this.setState({ isLoading: false, isLogin: true, isCodigo: true });
                } else {
                  alert(response.data.Descricao, "Erro", false);
                  this.setState({ isLoading: false, isLogin: true });
                }
              } else {
                alert('Erro na comunicação com servidor!', 'Atenção', false);
                this.setState({ isLoading: false, isLogin: true });
              }
              this.setState({ open: false });
            }} color="primary" autoFocus>
              Ok
          </Button>
          </DialogActions>
        </Dialog>

      </div>
    );
  }

  form() {
    if (this.state.isLogin) {
      return this.inicial();
    } else if (this.state.isLoading) {
      return <Carregando />;
    }
  }


  render() {
    return (
      <>
        {this.form()}
        {this.mdCadastro()}
      </>
    );
  }

  mdCadastro() {

    return (
      <Modal
        open={this.state.mdCadastro}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        onClose={() => {
          this.setState({ mdCadastro: false })
        }}>
        <div style={{ backgroundColor: '#ffffff', borderTopRightRadius: 0, borderTopLeftRadius: 0 }}>
          <div style={{ marginLeft: 15, marginRight: 15, marginTop: 25 }}>
            <InputLabel htmlFor="input-with-icon-adornment">Seu Nome</InputLabel>
            <Input
              value={this.state.nomeCadastro}
              useNativeDriver={true}
              disabled={this.state.isCodigo}
              name="nomeCadastro"
              onChange={this.handleChange}
            />
          </div>

          <div style={{ marginLeft: 15, marginRight: 15, marginTop: 25 }}>
            <InputLabel htmlFor="input-with-icon-adornment">CPF (Opcional)</InputLabel>
            <Input
              value={this.state.cpfCadastro}
              useNativeDriver={true}
              disabled={this.state.isCodigo}
              oname="cpfCadastro"
              onChange={this.handleChange}
            />
          </div>


          <Button variant="contained" color="primary" onClick={async () => {
            if (this.state.nomeCadastro.length > 3) {
              this.setState({ isLoading: true, isLogin: false, isCodigo: false, mdCadastro: false });
              const data = new FormData();
              data.append('nome', this.state.nomeCadastro);
              data.append('telefone', this.state.telefone);
              data.append('CPF', this.state.cpfCadastro);
              data.append('Dt_Nsc', '');
              data.append('acao', 'cadastrar');
              const response = await api.post('ws/CadastrarUsuario.php', data);
              if (response.status === 200) {
                console.log('Resposta: ', response.data)
                if (response.data.Descricao === 'Usuario Nao Cadastrado') {
                  alert('Erro ao cadastrar usuário!', 'Atenção', false);
                  this.setState({ isLoading: false, isLogin: true, mdCadastro: true });
                } else {

                  localStorage.setItem('@webApp/username', response.data.Nome);
                  localStorage.setItem('@webApp/userid', response.data.id);
                  localStorage.setItem('@webApp/usertelefone', response.data.Telefone);
                  localStorage.setItem('@webApp/usercpf', response.data.CPF);
                  localStorage.setItem('@webApp/userdtnsc', response.data.Dt_Nsc);

                  this.props.history.push({
                    pathname: '/',
                    state: {
                      servico: response.data.Codigo,
                    }
                  })

                }
              } else {
                alert('Erro na comunicação com servidor!', 'Atenção', false);
                this.setState({ isLoading: false, isLogin: true });
              }
            } else {
              alert('Nome inválido', 'Atenção', false);
            }

          }

          } style={{ marginTop: 40, marginBottom: 50 }}>
            Cadastro
          </Button>
        </div>
      </Modal >
    );
  }
}
