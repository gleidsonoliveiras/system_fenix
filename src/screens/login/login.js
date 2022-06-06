import React, { Component } from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Carregando from '../../fragments/carregando';
import Valid from './validaLogin';
import api, { apiSMS } from '../../utilites/api';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Img from 'react-image';
import Logo from '../../assets/img/logo.png';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  //border: '2px solid #000',
  boxShadow: "1px 3px 1px #000",
  p: 4,
};






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
      <div style={{ background: '#F2F2F2', height: '100%', width: '100%' }}>

        {/* Header */}


        
        <div class="container">
          <div class="row">
            <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
              <div class="card border-0 shadow rounded-3 my-5">
                <div class="card-body p-4 p-sm-5">
                  
                     <div class="logo" style={{textAlign: 'center'}}>
                      <img src={Logo } style={{width: 80, height: 80,  textAlign: 'center'}}/>
                     </div>
                  
                  
                  <h5 class="card-title text-center mb-5 fw-light fs-5"  style={{ fontWeight: 'bold', fontSize: 30, color: '#3056C7' }}>Login</h5>
                  
                    <p style={{ textAlign: 'justify', fontWeight:'bold', fontSize: 18 }}>
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
                  {this.state.isCodigo ?
          <div style={{ marginLeft: 15, marginRight: 15, marginTop: 25 }}>
            <InputLabel htmlFor="input-with-icon-adornment">Digite o código: <b style={{fontWeight: 'bold', fontSize: 20}}>{this.state.validador} </b> no campo abaixo</InputLabel>
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
          <Button variant="contained" color="primary" style={{ width: '98%', marginBottom: 25 }}
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
                </div>

            </div>
          </div>
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

        <Box sx={style}>
            <Typography>
                <div class="logo" style={{textAlign: 'center'}}>
                    <img src={Logo } style={{width: 80, height: 80,  textAlign: 'center'}}/>
                  </div>
            </Typography>

            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, color: '#3056C7'}}>
              CADASTRE-SE NO SISTEMA FENIX
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <InputLabel htmlFor="input-with-icon-adornment" style={{fontWeight: 'bold', marginTop: 25}}>Digite seu Nome</InputLabel>
                <Input
                  value={this.state.nomeCadastro}
                  useNativeDriver={true}
                  disabled={this.state.isCodigo}
                  name="nomeCadastro"
                  onChange={this.handleChange}
                  style={{width: '100%'}}
                />
            </Typography>

            <Typography>
              <InputLabel htmlFor="input-with-icon-adornment" style={{fontWeight: 'bold', marginTop: 25}}>Digite seu CPF (Opcional)</InputLabel>
                <Input
                  value={this.state.cpfCadastro}
                  useNativeDriver={true}
                  disabled={this.state.isCodigo}
                  oname="cpfCadastro"
                  onChange={this.handleChange}
                  style={{width: '100%'}}
                />
            </Typography>
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

          } style={{ marginTop: 40,  width: '100%', height: '60'}}>
            Cadastro
          </Button>
        </Box>

        



      </Modal >
    );
  }
}
