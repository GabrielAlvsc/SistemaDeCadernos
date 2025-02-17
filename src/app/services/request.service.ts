import axios from 'axios';
import { ParamService } from './params.service';
import { Injectable } from '@angular/core';
import { ValidatorService } from './validator.service';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//Serviço para fazer as requisições para a API 
export class RequestService {

  //Declara o Subject que gerencia o estado do spinner
  private spinnerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  //Obtem o estado atual do spinner para outros componentes assinarem e serem notificados quando o estado mudar
  getSpinnerState: Observable<boolean> = this.spinnerSubject.asObservable()

  constructor(
    private paramService: ParamService,
    private authService: AuthService,
    private validator: ValidatorService
  ) { }

  //Atualiza o estado para o spinner aparecer na tela
  openSpinner() {
    this.spinnerSubject.next(true)
  }

  //Atualiza o estado para o spinner sair da tela
  closeSpinner() {
    this.spinnerSubject.next(false)
  }

  async getRequest(route: string, id: string = '') {
    this.openSpinner()
    let ret: any
    let url = this.paramService.SERVER_URL + route

    if (id != '') {
      url = url + '/' + id
    }

    ret = await axios.get(url, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    })
      .then((response) => {
        return response
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.authService.logout()
        } else if (error.response.status == 400) {
          this.errorMessagePopup(error.response.data.message)
          return error.response
        }
      })
      .finally(
        () => {
          this.closeSpinner()
        }
      )
    return ret
  }


  async postRequest(route: string, json: any) {
    this.openSpinner()
    let ret: any
    ret = await axios.post(this.paramService.SERVER_URL + route, json
      , {
        headers: {
          'authorization': localStorage.getItem('token')
        }
      })
      .then((response) => {
        return response
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.authService.logout()
        } else if (error.response.status == 400) {
          this.errorMessagePopup(error.response.data.message)
          return error.response
        }
      })
      .finally(
        () => {
          this.closeSpinner()
        }
      )
    return ret
  }

  async patchRequest(route: string, id: string, equipment: any = '') {
    this.openSpinner()
    let ret: any
    ret = await axios.patch(this.paramService.SERVER_URL + route + '/' + id,
      equipment, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    })
      .then((response) => {
        return response
      })
      .catch((error) => {
        if (error.response.status == 400) {
          this.errorMessagePopup(error.response.data.message)
        } else if (error.response.status == 401) {
          this.authService.logout()
          return error.response
        }
        return error.response
      })
      .finally(
        () => {
          this.closeSpinner()
        }
      )
    return ret
  }

  async putRequest(route: string, id: string, json: any = '') {
    this.openSpinner()
    let ret: any
    ret = await axios.put(this.paramService.SERVER_URL + route + '/' + id,
      json, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    })
      .then((response) => {
        return response
      })
      .catch((error) => {
        if (error.response.status == 400) {
          this.errorMessagePopup(error.response.data.message)
        } else if (error.response.status == 401) {
          this.authService.logout()
        }
        return error.response
      })
      .finally(
        () => {
          this.closeSpinner()
        }
      )
    return ret
  }

  async deleteRequest(route: string, id: string) {
    this.openSpinner()
    let ret: any
    ret = await axios.delete(this.paramService.SERVER_URL + route + '/' + id, {
      headers: {
        'authorization': localStorage.getItem('token')
      }
    })
      .then((response) => {
        return response.status
      })
      .catch((error) => {
        if (error.response.status == 401) {
          this.authService.logout()
        } else if (error.response.status == 400) {
          this.errorMessagePopup(error.response.data.message)
          return error.response
        }
        return error.response.status
      })
      .finally(
        () => {
          this.closeSpinner()
        }
      )
    return ret
  }


  errorMessagePopup(text: string){
    if(text != undefined){
      this.validator.openSnackBar(text)
    } else {
      this.validator.openSnackBar(
        'Não foi possivel se conectar ao servidor, verifique sua conexão com a internet e/ou o status do servidor.'
      ) 
    }
  }

  checkStatus(status: number): boolean{
    if(status == 201 || status == 200){
      return true
    } else {
      return false
    }
  }
}
