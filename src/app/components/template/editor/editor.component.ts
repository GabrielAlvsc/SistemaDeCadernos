import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor'; 
import { Observable } from 'rxjs';
import { ParamService } from 'src/app/services/params.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})

//Campo de input para texto formatado 
export class EditorComponent implements OnInit, OnDestroy{

  //O componente pai pode definir o valor de 'value' quando usa esse componente no seu template
  @Input() value: string = ''

  //Permite que o componente possa emitir eventos para o componente pai
  @Output() editordoc = new EventEmitter<string>()

  disable: boolean = false
  concluded!: boolean

  constructor(
    private paramService: ParamService
  ) {}

  //Quando ocorre mudança no 'value' emite um novo valor para o componente pai
  onValueChange(){
    this.editordoc.emit(this.value)
  }

  editor!: Editor;

  // Recursos de formatação
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  ngOnInit(): void {
    this.editor = new Editor();
    //Inscrição para validar se o template deverá estar desabilitado ou não
    this.paramService.disable$.subscribe((value: boolean) => {
      this.disable = value;
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
