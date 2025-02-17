import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from './../../../services/request.service';
import { DatePipe } from '@angular/common';
import { ValidatorService } from 'src/app/services/validator.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Notebook } from 'src/app/app-objects';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-notebook-assign',
  templateUrl: './notebook-assign.component.html',
  styleUrls: ['./notebook-assign.component.css']
})
export class NotebookAssignComponent implements OnInit {

  minDate!: Date
  teste: any

  constructor(
    private requestService: RequestService,
    private router: Router,
    private datePipe: DatePipe,
    private book: Notebook,
    private fb: FormBuilder,
    public shareService: ShareService,
    private validator: ValidatorService
  ) {
    this.minDate = new Date()
  }

  notebookForm!: FormGroup
  createForm() {
    this.notebookForm = this.fb.group({
      model: new FormControl('', [Validators.required]),
      equipment: new FormControl('', [Validators.required]),
      respUser: new FormControl('', [Validators.required]),
      execUser: new FormControl('', [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required, this.dateValidator('startDate')]),
      SGD: new FormControl('')
    })
  }

  //Parametros da URL
  url: string = window.location.href
  params = this.url.split('/')
  route: string = this.params[4]
  editMode: boolean = this.params[5] === 'edit'
  bookID: string = this.params[6]

  //Labels
  title: string = ''
  button: string = ''

  //DataSources
  data: any
  equipments: any
  models: any
  users: any

  //Variaveis de Controle
  disabled: boolean = false
  buttonDisabled: boolean = false
  
  selectedEquipment: any

  async ngOnInit() {
    this.createForm()
    let returnRequest: any

    returnRequest = await this.requestService.getRequest('availableModels') 
    this.models = returnRequest.data.models
    this.equipments = returnRequest.data.equipments
    this.users = returnRequest.data.users

    if (this.editMode) {
      this.notebookForm.get('model')?.disable()
      this.notebookForm.get('equipment')?.disable()
      this.title = 'Editar Caderno'
      this.button = 'Salvar'
      returnRequest = await this.requestService.getRequest('book', this.bookID)
      this.data = returnRequest.data

      this.buttonDisabled = true
      this.disabled = (this.data.status != "Pendente")

      if (this.disabled) {
        this.notebookForm.get('respUser')?.disable()
        this.notebookForm.get('execUser')?.disable()
        this.notebookForm.get('startDate')?.disable()
        this.notebookForm.get('endDate')?.disable()
        this.notebookForm.get('SGD')?.disable()
      }

      this.loadFields(this.data)

    } else {
      this.title = 'Novo Caderno'
      this.button = 'Cadastrar'
    }
  }

  openSelectEquipament() {
    this.validator.dialogSelectEquipment('0ms', '0ms', this.equipments)
      .subscribe(result => {
        if (result) {
          this.selectedEquipment = result;
          this.notebookForm.get('equipment')?.setValue(result.id); 
        }
      });
  }

  openSelectModel() {
    this.validator.dialogSelectModel('0ms', '0ms', this.models)
      .subscribe(result => {
        if (result) {
          this.selectedEquipment = result;
          this.notebookForm.get('model')?.setValue(result.id); 
        }
      });
  }

  dateValidator(startDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDateControl = control.parent?.get(startDateControlName);

      if (startDateControl && control.value) {
        const startDate = startDateControl.value as Date;
        const endDate = control.value as Date;

        if (endDate <= startDate) {
          return { errorDate: true };
        }
      }

      return null;
    };
  }

  async request() {
    let status: any
    this.setData()
    if (this.editMode) {
      let patchObject = {
        user_responsible_id: this.book.user_responsible_id,
        user_executor_id: this.book.user_executor_id,
        start_date: this.book.start_date,
        end_date: this.book.end_date,
        sgd: this.book.sgd
      }

      status = await this.requestService.patchRequest('book', this.bookID, patchObject)
    } else {
      this.notebookForm.markAllAsTouched()
      this.notebookForm.get('endDate')?.markAsDirty()
      this.notebookForm.get('endDate')?.updateValueAndValidity()
      status = await this.requestService.postRequest('book', this.book);
    }
    if (status.status === 200 || status.status === 201) {
      this.goBack()
    }
  }

  loadFields(data: any) {
    this.notebookForm.setValue({
      model: data.version.model_id,
      equipment: data.equipament_id,
      respUser: data.user_responsible_id,
      execUser: data.user_executor_id,
      SGD: data.sgd,
      startDate: this.shareService.stringToDate(data.start_date),
      endDate: this.shareService.stringToDate(data.end_date)
    })
  }

  cancel() {
    this.goBack()
  }

  goBack() {
    this.router.navigate([this.route]);
  }

  //GARANTIR QUE OS CAMPOS SEJAM TODOS PREENCHIDOS ANTES DE FAZER A REQUISIÇÃO
  async setData() {
    //Passa as informações para o Objeto
    let startDate: any
    if (this.notebookForm.get('startDate')?.dirty) {
      startDate = this.notebookForm.get('startDate')!.value.toDate()
    } else {
      startDate = this.notebookForm.get('startDate')!.value
    }

    let endDate: any
    if (this.notebookForm.get('endDate')?.dirty) {
      endDate = this.notebookForm.get('endDate')!.value.toDate()
    } else {
      endDate = this.notebookForm.get('endDate')!.value
    }

    this.book.model_id = Number(this.notebookForm.get('model')!.value)
    this.book.equipament_id = Number(this.notebookForm.get('equipment')!.value)
    this.book.user_responsible_id = Number(this.notebookForm.get('respUser')!.value)
    this.book.user_executor_id = Number(this.notebookForm.get('execUser')!.value)
    this.book.start_date = String(startDate)
    if (this.notebookForm.get('startDate')!.value.errors == null) {
      this.book.start_date = this.datePipe.transform(startDate, 'dd/MM/yyyy')
    } else {
      this.book.start_date = ''
    }
    this.book.end_date = String(endDate)
    if (this.notebookForm.get('endDate')!.value.errors == null) {
      this.book.end_date = this.datePipe.transform(endDate, 'dd/MM/yyyy')
    } else {
      this.book.end_date = ''
    }
    this.book.sgd = this.notebookForm.get('SGD')!.value
  }
}
