import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { Router } from '@angular/router';
import { Model } from 'src/app/app-objects';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-model-create',
  templateUrl: './model-create.component.html',
  styleUrls: ['./model-create.component.css']
})

//Tela de criação do modelo de caderno
//path: models/create
export class ModelCreateComponent implements OnInit {

  title = new FormControl('', [Validators.required]);
  category = new FormControl('', [Validators.required]);
  categories: any

  constructor(
    public model: Model,
    private requestService: RequestService,
    private router: Router,
  ) {}

  async ngOnInit() {
    let response = await this.requestService.getRequest('categories')
    this.categories = response.data
  }

  async save() {
    this.setData()
    const response = await this.requestService.postRequest('models',this.model)
    if (response.status == 201) {
      this.goBack()
    }
  }

  //Salvar os dados de entrada no objeto model
  setData() { 
    this.model.title = this.title.value
    this.model.category_id = Number(this.category.value)
  }

  goBack() {
    this.router.navigate(['models'])
  }
}
