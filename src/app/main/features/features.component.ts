import { Router } from '@angular/router';
import { RequestService } from './../../services/request.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/services/validator.service';
import { Features } from 'src/app/app-objects';
import { ParamService } from 'src/app/services/params.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})

export class FeaturesComponent implements OnInit {
  constructor(public features: Features, 
              private requestService: RequestService, 
              private router: Router,
              private validator: ValidatorService,
              private sparams: ParamService){}

  url: string = window.location.href
  params = this.url.split('/')

  model_id = this.params[5]
  feature_id = this.params[8]
  model_name = ''


  title = ''
  button_label = ''
  data: any
  concluded: boolean = false

  name = new FormControl('', [Validators.required]);
  is_variable = new FormControl(false, [Validators.required]);

  radioValue: boolean = false
  pagButtonC = ''

  async ngOnInit() {
    let ret: any

    ret = await this.requestService.getRequest('model/content', this.model_id)
    this.model_name = ret.data.model.title

    this.pagButtonC = 'Voltar' 
    if (localStorage.getItem('concluded') == 'true') {
      this.name.disable()
      this.is_variable.disable()
      this.concluded = true
    } else {
      this.name.enable()
      this.is_variable.enable()
      this.concluded = false
    }
    
    if (this.params[7] == 'edit'){
      this.title = 'Edição de Característica'
      this.button_label = 'Salvar'
      ret = await this.requestService.getRequest('features', this.feature_id)
      this.data = ret.data
    } else {
      this.title = 'Cadastro de Característica'
      this.button_label = 'Criar'
      this.data = {"name": "", "is_variable": false, "version_id": null}
    }
    this.loadFields(this.data)
  }

  async RequestSelector(){
    let status: any
    if (this.params[7] === 'edit') {
      status = await this.requestService.patchRequest('features', this.feature_id, this.setData())
    } else {
      status = await this.requestService.postRequest('features', this.setData());
    }

    if (status.status == 201 || status.status == 200) {
      this.GoBack()
    }
  }

  loadFields(data: any) {
    this.name.setValue(data.name)
    this.is_variable.setValue(data.is_variable) 
  }

  setData(){
    return {
      "name": this.name.value,
      "is_variable": this.is_variable.value,
      "version_id": this.sparams.VersionId
    }
  }

  GoBack(){
      this.router.navigate([`models/${this.model_id}`])
  }

  async deleteEquip() {
    this.validator.dialogDelete('0ms', '0ms')   
  }
}
