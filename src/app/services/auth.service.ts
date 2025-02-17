import axios from 'axios';
import { ParamService } from './params.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ValidatorService } from './validator.service';

@Injectable({
  providedIn: 'root'
})

//Classe de serviço para autenticar o usuário
export class AuthService {

  constructor(
    private router: Router,
    private paramService: ParamService,
    private validator: ValidatorService
  ) {
  }

  //Requisição para logar o usuário com as credenciais
  login(username: any, password: any) {
    axios.post(this.paramService.SERVER_URL + 'login', {
      username: username.value,
      password: password.value
    })
      .then((response) => {
        //Armazena as informações do usuário logado no localStorage do navegador 
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('profile', response.data.profile)
        localStorage.setItem('name', response.data.name)
        localStorage.setItem('cpass', response.data.changePassword)
        this.router.navigate(['home'])
      })
      
      .catch((error) => {
        //Exibe pop-up com alerta de erro
        this.errorMessagePopup(error.response.data.message)
      })
  }

  logout() {
    //Apaga as informações do usuário do localStorage e redireciona para a tela de login
    localStorage.clear()
    this.router.navigate(['login'])
  }

  logged() {
    //Informa se o usuário está logado validando o campo token do localStorage
    return localStorage.getItem("token") ? true : false
  }

  errorMessagePopup(text: string){
    if(text != undefined){
      this.validator.openSnackBar(text)
    } else {
      this.validator.openSnackBar('Não foi possivel se conectar ao servidor, verifique sua conexão com a internet e/ou o status do servidor!') 
    }
  }
}
