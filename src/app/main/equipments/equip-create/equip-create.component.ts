import { Router } from '@angular/router';
import { RequestService } from './../../../services/request.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ValidatorService } from 'src/app/services/validator.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Equipment } from 'src/app/app-objects';
import { MatStepper } from '@angular/material/stepper';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-equip-create',
  templateUrl: './equip-create.component.html',
  styleUrls: ['./equip-create.component.css']
})

export class EquipCreateComponent implements OnInit {
  @ViewChild(MatStepper) stepper!: MatStepper;

  constructor(
    private requestService: RequestService,
    private router: Router,
    private datePipe: DatePipe,
    private validator: ValidatorService,
    public equipment: Equipment,
    private fb: FormBuilder,
    private shareService: ShareService
  ) { }

  //Parametros da URL
  url: string = window.location.href
  params = this.url.split('/')
  route: string = this.params[4]
  equipmentID: string = this.params[6]!
  editMode: boolean = (this.params[5] === 'edit')

  //Labels
  title: string = ''
  button: string = ''
  finish_button: string = ''
  data: any
  error = ''

  //FormControls
  equipmentForm!: FormGroup
  endOfSalesForm!: FormGroup

  //Variaveis Referente a listagem de Imagem
  images: any
  images_length: number = 0
  formData = new FormData()

  //Variaveis de Controle
  completed: boolean = false
  firstStep: string = ''
  itemId: string = ''
  requested: boolean = false

  createForm() {
    this.equipmentForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      vendor: new FormControl('', [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      sap: new FormControl('')
    });

    this.endOfSalesForm = this.fb.group({
      endofsales: new FormControl(null)
    });
  }

  async ngOnInit() {
    this.createForm()
    let ret: any
    if (this.editMode) {
      this.title = 'Edição'
      this.button = 'Gerenciar Imagem'
      this.finish_button = 'Finalizar alteração'
      this.firstStep = 'Editar Informações'
      ret = await this.requestService.getRequest(this.route, this.equipmentID)
      this.data = ret.data
      this.getImages()
      this.completed = true
    } else {
      this.title = 'Cadastro'
      this.button = 'Próximo'
      this.finish_button = 'Finalizar cadastro'
      this.firstStep = 'Cadastro Informações'
      this.data = { "name": "", "vendor": "", "price": null, "endofsales": null}
    }
    this.loadFields(this.data)
  }

  async postOrPatchRequest(exitScreen: boolean = false) {
    let ret: any
    let id: string = ''
    this.setData()
    id = this.equipmentID

    if (this.editMode || this.itemId != '') {

      if(id == undefined){
        id = this.itemId
      }

      ret = await this.requestService.patchRequest('equipments', id, this.equipment)
    } else {
      ret = await this.requestService.postRequest('equipments', this.equipment);
    }
    if (ret.status === 200) {
      this.requested = true
      if(exitScreen){
        this.goBack()
      } else {
        if(this.itemId == ''){
          this.itemId = ret.data.id
        }
        this.stepper.next();
      }
    }
  }

  loadFields(data: any) {
    this.equipmentForm.setValue({
      name: data.name,
      vendor: data.vendor,
      price: data.price,
      sap: data.sap,
    })

    if(data.endofsales == null){
      this.endOfSalesForm.setValue({
        endofsales: null
      })
    } else {
      this.endOfSalesForm.setValue({
        endofsales: this.shareService.stringToDate(data.endofsales)
      })
    }

  }

  cancel() {
    this.goBack()
  }

  goBack() {
    this.router.navigate([this.route]);
  }

  async deleteEquip() {
    this.validator.dialogDelete('0ms', '0ms')
  }

  setData() {
    //Preenche os campos da tela com seus respectivos valores(da table)
    this.equipment.name = this.equipmentForm.get('name')?.value
    this.equipment.vendor = this.equipmentForm.get('vendor')?.value
    this.equipment.price = this.equipmentForm.get('price')?.value
    this.equipment.sap = this.equipmentForm.get('sap')?.value
    if(this.endOfSalesForm.get('endofsales')?.dirty && this.endOfSalesForm.get('endofsales')?.value) {
      this.equipment.endofsales = this.datePipe.transform(this.endOfSalesForm.get('endofsales')?.value.toDate(), 'dd/MM/yyyy')
    } else {
      this.equipment.endofsales = null
    }
  }

  async onFileSelected(event: any) {
    let ret: any
    let id: string = ''

    const files = event.target.files
    if (files) {

      for (let i = 0; i < files.length; i++) {
        this.formData.append("images", files[i])
      }

      if (this.editMode || this.itemId == ''){
        id = this.equipmentID
      } else {
        id = String(this.itemId)
      }

      ret = await this.requestService.postRequest('uploadEquipmentImages/' + id, this.formData)

      this.formData = new FormData()
      this.getImages()
    }
  }

  async getImages() {
    let ret: any
    let id: string = ''

    if (this.editMode || this.itemId == ''){
      id = this.equipmentID
    } else {
      id = String(this.itemId)
    }

    ret = await this.requestService.getRequest('EquipmentsImage/' + id)
    
    this.images = ret.data
    this.images_length = ret.data.length
  }

  copyUrl() {
    navigator.clipboard.writeText(this.images.path)
  }

  checkStep(event: any) {
    if (event.selectedIndex === 1) {
      if(this.requested == false){
        this.postOrPatchRequest()
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            this.processPastedImage(file);
          }
        }
      }
    }
  }

  async processPastedImage(file: File) {
    let ret: any
    let id: string
    const fileInput = document.querySelector('.file-input') as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    this.formData = new FormData()

    if (fileInput.files) {
      this.formData.append("images", fileInput.files[0])

      if (this.editMode || this.itemId == ''){
        id = this.equipmentID
      } else {
        id = String(this.itemId)
      }

      ret = await this.requestService.postRequest('uploadEquipmentImages/' + id, this.formData)
      this.getImages()
    }
  }
}

