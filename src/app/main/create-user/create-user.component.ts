import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/app-objects';
import { RequestService } from 'src/app/services/request.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})

export class CreateUserComponent {

  constructor(
    private request: RequestService,
    private validator: ValidatorService,
    private fb: FormBuilder,
    public user: User,
    private location: Location,
  ){}

  fields!: FormGroup
  profiles = [
    {
      id: 0,
      name: 'CDT',
      value: 'cdt',
      description: 'Perfil destinado a usuários internos do CDT' 
    },
    {
      id: 1,
      name: 'Partner',
      value: 'partner',
      description: 'Perfil destinado a terceiros'
    }
  ]

  title: string = ''

  async ngOnInit(){
    this.createForm()
    if(true){
      this.title = 'Criar Usuário'
      this.loadFields({ "username": "", "name": "", "email": "", "profile": "", "company": ""})
    } else {    
      this.title = 'Editar Usuário'
      let response = await this.request.getRequest('user')
      this.loadFields(response.data)
    }
  }

  loadFields(data: any) {
    this.fields.setValue({
      username: data.username,
      name: data.name,
      email: data.email,
      profile: data.profile,
      company: data.company,
    })
  }

  setTableUserData() {
    this.user.username = this.fields.get('username')?.value
    this.user.name = this.fields.get('name')?.value
    this.user.email = this.fields.get('email')?.value
    this.user.profile = this.fields.get('profile')?.value
    this.user.company = this.fields.get('company')?.value
  }

  createForm() {
    this.fields = this.fb.group({
      username: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      profile: new FormControl('', [Validators.required]),
      company: new FormControl('', [Validators.required]),
    })
  }

  async createUser(){
    this.setTableUserData()
    let ret = await this.request.postRequest('users', this.user)
    if(ret.status == 200 || ret.status == 201){
      console.log(ret.data)
      // this.validator.openSnackBar(`Usuário criado com a senha: ${ret.data.password}`)
      this.copyUrl(ret.data.password)
      this.loadFields({ "username": "", "name": "", "email": "", "profile": "", "company": ""})
    }
  }

  goBack(){
    this.location.back();
  }

  copyUrl(Password: string) {
    if(Password != undefined){
      navigator.clipboard.writeText(Password)
      this.validator.openSnackBarPositive(`Usuário criado! Senha copiada para a área de trânferencia.`)
    }
  }
}
