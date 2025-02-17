import { Fields, Type_fields } from './../../app-objects';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Items } from 'src/app/app-objects';
import { ItemService } from 'src/app/services/item.service';
import { ParamService } from 'src/app/services/params.service';
import { RequestService } from 'src/app/services/request.service';
import { ShareService } from 'src/app/services/share.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

//Tela de conteúdo do item de teste
//paths: models/modelId/item/create
//       models/modelId/item/edit/itemId
export class ItemsComponent {

  constructor(
    public items: Items,
    private requestService: RequestService,
    private router: Router,
    private validator: ValidatorService,
    private paramService: ParamService,
    private itemService: ItemService,
    private shareService: ShareService
  ) { }

  url: string = window.location.href
  urlPaths = this.url.split('/')

  //Valores que mudam de acordo com a url
  pageTitle = ''
  buttonTitle = ''

  //Dados de entrada
  title = new FormControl('', [Validators.required]);
  description: string = ''
  fillable = new FormControl(false, [Validators.required]);
  mandatory = new FormControl(false, [Validators.required]);
  is_subitem = new FormControl(false, [Validators.required]);
  father_id = new FormControl(false, [Validators.required]);

  currentItemID: number = 0

  //Dados dos campos do item
  fields: Fields[] = []
  itensIV: Items[] = []
  itensIT: Items[] = []
  treeIds: any[] = []
  typefields: Type_fields[] = []
  fieldsVersion: Fields[] = []

  images: any
  concluded: boolean = false

  //Dados das features para campos do tipo característica
  features: any
  featureFields: any[] = []
  variableFeatures: any[] = []
  previousValue: number | null = null

  model_id = this.urlPaths[5]
  item_id = this.urlPaths[8]
  model_name = ''
  maxOrder: number = 0

  async ngOnInit() {
    let response: any
    let tree: any
    this.concluded = localStorage.getItem('concluded') == 'true'
    // desabilita ou habilita os campos de acordo com o status concluído da versão do modelo
    if (this.concluded) {
      this.title.disable()
      this.fillable.disable()
      this.mandatory.disable()
      this.is_subitem.disable()
      this.father_id.disable()
    } else {
      this.title.enable()
      this.fillable.enable()
      this.mandatory.enable()
      this.is_subitem.enable()
      this.father_id.enable()
    }
    this.paramService.setDisable(this.concluded)
    this.paramService.concluded = this.concluded

    response = await this.requestService.getRequest('model/content', this.model_id)
    this.model_name = response.data.model.title
    this.features = response.data.features
    this.itensIV = response.data.itemsInVersion
    if (this.itensIV.length == 0) {
      console.log("Ainda nao há itens")
      this.is_subitem.disable() //desabilitar se nao tiver nenhum item pra colocar como pai
    }
    //fazer o mesmo pra itens

    



    //Resgata as informações do item se estiver na tela de edição
    if (this.urlPaths[7] == 'edit') {

      this.pageTitle = 'Edição de Item'
      tree = await this.requestService.getRequest('treeids', this.item_id)
      this.treeIds = tree.data

      for (const i in this.itensIV) {
        if (!this.treeIds.includes(this.itensIV[i].id)) {
          this.itensIT.push(this.itensIV[i])
        }
      }

      if (this.itensIT.length == 0) {
        this.is_subitem.disable() //desabilitar se nao tiver nenhum item pra colocar como pai
      }

      response = await this.requestService.getRequest('item', this.item_id)
      const item = response.data
      this.loadFields(item)
      this.buttonTitle = 'Salvar'

      response = await this.requestService.getRequest('fields', this.item_id)

      if (response.data.length == 0) {
        this.fields = []
      } else {
        this.fields = response.data
        this.maxOrder = this.fields[this.fields.length - 1].order_field + 1
      }
      for (let field of this.fields) {
        if (field.type_field_id == 5) {
          field.title_field = field.feature_id
        }
      }
      this.getImages()

    } else {
      this.pageTitle = 'Cadastro de Item'
      this.buttonTitle = 'Salvar'
      this.fields = []
    }

    response = await this.requestService.getRequest('typeFields')
    this.typefields = response.data

    //Define as features que são variáveis
    this.variableFeatures = await this.itemService.setVariableFeatures(this.paramService.VersionId, this.features)
  }

  //Carrega as informações na tela de edição
  loadFields(data: any) {
    this.title.setValue(data.title)
    this.description = data.description
    this.mandatory.setValue(data.mandatory)
    this.fillable.setValue(data.fillable)
    this.is_subitem.setValue(data.is_subitem)
    this.father_id.setValue(data.father_id)
  }

  //Define o corpo do item para a requisição
  setBody() {
    return {
      "title": this.title.value,
      "description": this.description,
      "mandatory": this.mandatory.value,
      "fillable": this.fillable.value,
      "version_id": this.paramService.VersionId,
      "is_subitem": this.is_subitem.value,
      "father_id": this.father_id.value
    }
  }

  addFields(id: number) {
    this.fields = this.itemService.addFields(id, this.maxOrder, this.fields)
    this.maxOrder += 1
  }

  //Resgata as imagens cadastradas no item
  async getImages() {
    let itemId = this.currentItemID != 0 ? this.currentItemID : Number(this.urlPaths[8])
    this.images = await this.itemService.getImages(itemId)
  }

  //Adiciona as imagens selecionadas na área de transferência
  async onFileSelected(event: any) {
    const files = event.target.files
    if (files) {
      if (this.urlPaths[7] == 'create') {
        await this.saveItem()
      }
      let itemId = this.currentItemID != 0 ? this.currentItemID : Number(this.urlPaths[8])
      await this.itemService.onFileSelected(files, itemId)
      this.getImages()
    }
  }

  //Reconhece o a imagem que esta no CRTL+V
  onPaste(event: ClipboardEvent) {
    // const clipboardData = event.clipboardData;
    // if (clipboardData) {
    //   const items = clipboardData.items;
    //   for (let i = 0; i < items.length; i++) {
    //     const item = items[i];
    //     if (item.type.indexOf('image') !== -1) {
    //       const file = item.getAsFile();
    //       if (file) {
    //         this.processPastedImage(file);
    //       }
    //     }
    //   }
    // }
  }

  async processPastedImage(file: File) {
    const fileInput = document.querySelector('.file-input') as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    if (fileInput.files) {
      if (this.urlPaths[7] == 'create') {
        await this.saveItem()
      }
      let itemId = this.currentItemID != 0 ? this.currentItemID : Number(this.urlPaths[8])
      await this.itemService.onFileSelected(fileInput.files, itemId)
      this.getImages()
    }
  }

  //Adiciona imagem ao texto formatado do NgxEditor
  addImageToEditor(index: number) {
    this.description += `<img src="${this.images[index].path}">\n`
  }

  //Salva as informações do Item
  async saveItem(endOfSession: boolean = false) {

    let posted: boolean = false
    let itemId: string = ''
    let response: any

    if (this.currentItemID != 0) {
      posted = true
      itemId = String(this.currentItemID)
    } else {
      itemId = this.urlPaths[8]
    }

    const srcArray = this.shareService.findImages(this.description)

    let imageName
    for(let src of srcArray) {
      try {
        response = await this.shareService.uploadImage(src, Number(itemId))
        imageName = `${response.data.imagens[0].path}`
        this.description = this.description.replace(src, imageName)
      }
      catch(error) {

      }
    }

    let hasEmptyTitle = false
    for(let field of this.fields) {

      if(field.title_field == 0 || field.title_field == "") {
        hasEmptyTitle = true
        this.validator.openSnackBar('O título dos campos deve ser preenchido')
      }
    }

    if(hasEmptyTitle === false) {
      if (this.urlPaths[7] == 'edit' || posted) {
        if (this.is_subitem.value){
          console.log(this.is_subitem.value)
          response = await this.requestService.patchRequest('subitem', itemId, this.setBody())
        } else {
          response = await this.requestService.patchRequest('subitem', itemId, this.setBody())
        }
      } else {
        if (this.is_subitem.value){
          response = await this.requestService.postRequest('subitem', this.setBody())
        } else {
          response = await this.requestService.postRequest('item', this.setBody())
        }
      }
      if (response.status == 200 || response.status == 201 || posted == true) {
        if (posted == false) {
          this.currentItemID = response.data.id
        }
        await this.saveFields()
        if (endOfSession) {
          this.goBack()
        }
      }
    }

  }

  //Salva as informações dos campos
  async saveFields() {
    let itemId = this.urlPaths[7] == 'create' ? this.currentItemID : Number(this.urlPaths[8])

    await this.itemService.updateFields(this.fields, this.variableFeatures, itemId)
  }

  async itemDelete() {
    this.paramService.auxObj = this.fields
    this.validator.dialogDelete('0ms', '0ms')
  }

  // Salva o valor anterior da característica variável no campo característica 
  // para reabilitá-lo na lista de características variáveis 
  savePreviousValue(index: number) {
    this.previousValue = this.fields[index].title_field
  }

  async deleteField(index: number) {
    let ret: any
    const featureIndex = this.variableFeatures.findIndex(
      (feature: any) => feature.id == this.fields[index].title_field)
    if (featureIndex !== -1) {
      this.variableFeatures[featureIndex].disabled = false;
    }
    this.fields = await this.itemService.deleteField(this.fields, index)
  }

  async deleteImage(index: number) {
    this.images = await this.itemService.deleteImage(this.images, index)
  }

  fieldChange(index: number, field: string, value: string) {
    switch (field) {
      case 'title_field':
        this.fields[index].title_field = value
        break;
      case 'standard_value':
        this.fields[index].standard_value = value
        break
    }
  }

  //Na lista de características variáveis altera a visibilitade da característica que foi selecionada
  changeFeatureVisibility(index: number) {
    this.variableFeatures = this.itemService.
      changeFeatureVisibility(index, this.variableFeatures, this.previousValue!, this.fields)
  }

  async goBack(clicked: boolean = false) {
    let response: any

    if (clicked && this.currentItemID != 0) {
      response = await this.requestService.deleteRequest('item', String(this.currentItemID))
    }

    this.router.navigate([`models/${this.urlPaths[5]}`])
  }

  //Altera a ordem dos campos no item de acordo com a seta selecionada
  async setOrder(currentIndex: number, direction: string) {
    this.fields = await this.itemService.setOrder(currentIndex, direction, this.fields)
  }

}
