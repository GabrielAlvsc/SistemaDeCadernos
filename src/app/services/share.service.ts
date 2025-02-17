import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { format, parse } from 'date-fns';
import { RequestService } from './request.service';
import { ParamService } from './params.service';
import { MatSort, Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})

//Classe de métodos compartilhados por vários componentes
export class ShareService {

  constructor(
    private requestService: RequestService,
    private params: ParamService
  ) { }

  //Obtém a diretiva MatSort do template para habilitar a ordenação das colunas da tabela
  @ViewChild(MatSort) sort!: MatSort;

  //Aplica filtro nas tabelas
  applyFilter(event: Event, dataSource: any, route: string = '', scrollPosition: string = '') {
    const filterValue = (event.target as HTMLInputElement).value;
    sessionStorage.setItem('route', route)
    sessionStorage.setItem('filter', filterValue)

    dataSource.filter = filterValue.trim().toLowerCase();
    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  applyFilterbyString(input: string, dataSource: any) {
    dataSource.filter = input.trim().toLowerCase();
    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  @ViewChild('input') inputElement!: ElementRef;
  defineFilter(route: string, dataSource: any){
    const filterValue = sessionStorage.getItem('filter');
    const filterRoute = sessionStorage.getItem('route');

    if (filterValue && route == filterRoute) {
      this.inputElement.nativeElement.value = filterValue;
      this.applyFilterbyString(filterValue, dataSource);
    }
    else{
      sessionStorage.clear()
    }
  }

  //Converte data do tipo Date para String
  dateToString(date: Date) {
    try {
      const formattedDate = format(date, 'dd/MM/yyyy')
      return formattedDate
    } catch {
      return 'Não informado'
    }
  }

  //Converte data do tipo Date para String
  dateToStringWithHours(date: Date) {
    try {
      const formattedDate = format(date, 'dd/MM/yyyy hh:mm')
      return formattedDate
    } catch {
      return 'Não informado'
    }

  }

  //Converte data do tipo String para Date
  stringToDate(dateString: string) {
    const format = 'dd/MM/yyyy'
    let formattedDate = parse(dateString, format, new Date())
    return formattedDate
  }

  stringToDateF(dateString: string){
    const parts = dateString.split('/');
    const date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    return date
  }

  //Faz a requisição para gerar PDF do modelo ou caderno
  async createPDF(book_id: number | string | null, model_id: number | string, version_id: number | string) {
    let returnedObj: any

    returnedObj = await this.requestService.postRequest('createPDF',
      {
        book_id: book_id,
        model_id: model_id,
        version_id: version_id
      })

    window.open(`${this.params.SERVER_URL}pdf/${returnedObj.data.id}`)
  }

  //Gerencia o fluxo de ordenação de itens ou características que estão em uma tabela
  async setOrder(currentIndex: number, direction: string, dataSource: any, table: string) {

    let targetIndex
    let currentOrder
    let targetOrder

    switch (direction) { //colocar o index correto

      case 'up': targetIndex = currentIndex - 1
        break

      case 'down': targetIndex = currentIndex + 1
        break
    }

    // O atributo order do objeto muda de acordo com a posição anterior e alvo
    if (targetIndex! >= 0 && targetIndex! < dataSource.length) {
      currentOrder = dataSource[currentIndex].order
      targetOrder = dataSource[targetIndex!].order

      let body = {
        id0: dataSource[currentIndex].id,
        id1: dataSource[targetIndex!].id,
        order0: dataSource[currentIndex].order,
        order1: dataSource[targetIndex!].order
      }

      let response = await this.requestService.postRequest(table + 'SwapOrders', body)

      if (response.status == 200 || response.status == 201) {
        dataSource[currentIndex].order = targetOrder
        dataSource[targetIndex!].order = currentOrder
        return this.sortOrder(dataSource)
      }
    }
    return dataSource
  }

  //Ordena os dados de forma crescente
  sortOrder(list: any) {
    return list.sort((a: any, b: any) => {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    });
  }

  async setItemOrder(currentIndex: number, direction: string, dataSource: any, table: string) {

    let targetIndex
    let currentOrder
    let targetOrder
    let currentFullOrder
    let targetFullOrder
    let fid = dataSource[currentIndex].father_id
    let childrensIndex

    switch (direction) { //colocar o index correto

      case 'up': targetIndex = currentIndex - 1
        while (dataSource[targetIndex!].father_id != fid) {
          targetIndex = targetIndex - 1
          if (targetIndex! < 0) break
        }
        break

      case 'down': targetIndex = currentIndex + 1
        while (dataSource[targetIndex!].father_id != fid) {
          targetIndex = targetIndex + 1
          if (targetIndex! > dataSource.length) break
        }
        break
    }

    // O atributo order do objeto muda de acordo com a posição anterior e alvo
    if (targetIndex! >= 0 && targetIndex! < dataSource.length) {
      currentOrder = dataSource[currentIndex].order
      currentFullOrder = dataSource[currentIndex].fullorder
      targetOrder = dataSource[targetIndex!].order
      targetFullOrder = dataSource[targetIndex!].fullorder

      let body = {
        id0: dataSource[currentIndex].id,
        id1: dataSource[targetIndex!].id,
        order0: dataSource[currentIndex].order,
        order1: dataSource[targetIndex!].order
      }

      let response = await this.requestService.postRequest(table + 'SwapOrders', body)

      if (response.status == 200 || response.status == 201) {
        dataSource[currentIndex].order = targetOrder
        dataSource[currentIndex].fullorder = targetFullOrder
        dataSource[targetIndex!].order = currentOrder
        dataSource[targetIndex!].fullorder = currentFullOrder
        return this.sortFullOrder(dataSource)
      }
    }
    return dataSource
  }

  //Ordena os dados de forma crescente
  sortItemOrder(list: any) {
    return list.sort((a: any, b: any) => {
      console.log(String(a.fullorder));
      console.log(String(b.fullorder));
      console.log("localecompare" + String(a.fullorder).localeCompare(String(b.fullorder), "en", { numeric: true }));
      return String(a.fullorder).localeCompare(String(b.fullorder), "en", { numeric: true });
    });
  }

  sortFullOrder(list: any) {
    return list.sort((a: any, b: any) => {
      // console.log(String(a.fullorder));
      // console.log(String(b.fullorder));
      let c = a.fullorder.split(".");
      // console.log(c);
      let d = b.fullorder.split(".");
      // console.log(d);
      if (c.length == d.length) {
        if (c[0] < d[0]) return -1;
        if (c[0] > d[0]) return 1 ;
      }

      else if (c.length < d.length) {
        for (let i = 0; i<c.length; i++) {
          if (c[i] < d[i]) return -1;
          if (c[i] > d[i]) return 1 ;
        }
        return -1;
      }

      else {
        for (let i = 0; i<d.length; i++) {
          if (c[i] < d[i]) return -1;
          if (c[i] > d[i]) return 1 ;
        }
        return 1;
      }
      return 0;

    });
  }


  //Ordena os dados da tabela na ordem selecionada
  sortData(sort: Sort, toSortList: any, dataSource: any) {
    const isAsc = sort.direction === 'asc'
    let dateA: Date | null = null
    let dateB: Date | null = null
    let auxiliaryData = toSortList.slice()

    if (!sort.active || sort.direction === '') {
      dataSource.data = auxiliaryData
      return
    }

    dataSource.data = auxiliaryData.sort((a: any, b: any) => {

      switch (typeof a[sort.active]) {
        case 'string': 
          if (a[sort.active].includes('/')) {
            if (a[sort.active] == null) {
              if (b[sort.active] == null) {
                return 0 * (isAsc ? 1 : -1)
              } else {
                return -1 * (isAsc ? 1 : -1)
              }
            }
            if (b[sort.active] == null) {
              return 1 * (isAsc ? 1 : -1)
            }
            dateA = this.stringToDate(a[sort.active])
            dateB = this.stringToDate(b[sort.active])

            return this.compare(dateA.getTime(), dateB.getTime(), isAsc)
          } 
          else if (a[sort.active].includes('-')){
            let numberA = new Date(a[sort.active]).getTime();
            let numberB = new Date(b[sort.active]).getTime();
            return this.compare(numberA, numberB, isAsc)
          }
          else {
            return this.compare(a[sort.active], b[sort.active], isAsc)
          }
        case 'number':
          return this.compare(a[sort.active], b[sort.active], isAsc)
        default:
          return 0
      }
    })
  }

  //Compara os dados para ordernar de forma crescente ou descrecente
  compare(a: any, b: any, isAsc: boolean) {
    let result = 1
    if (a == b) {
      result = 0
    } else if (a < b) {
      result = -1
    }
    return result * (isAsc ? 1 : -1)
  }

  //Identifica quantas imagens existem no parâmetro
  findImages(description: string) {
    const regex: RegExp = /src="([^"]*)"/g;
    const matches: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(description)) !== null) {
      if(this.isBase64Image(match[1])) {
        matches.push(match[1]);
      }
    }

    return matches
  }

  //Valida se a fonte da imagem é do tipo base 64
  isBase64Image(src: string): boolean {
    const regex = /^data:image\/(jpeg|png|gif|bmp|webp);base64,/;
    return regex.test(src);
  }

  //Extrai o dado do tipo base64
  extractBase64Data(src: string): { format: string, data: string } | null {
    const matches = src.match(/^data:image\/(jpeg|png|gif|bmp|webp);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
      return null;
    }
    const [, format, data] = matches;
    return { format, data };
  }

  //Transforma o dado da imagem de base 64 para binário
  base64ToFile(base64: string, filename: string): File {
    const byteString = atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([intArray], { type: `image/${filename.split('.').pop()}` });
    return new File([blob], filename);
  }

  // Recebe a imagem em base64, faz a validação, extração e conversão do valor para salvar no banco
  async uploadImage(base64Image: string, itemId: number) {
    if (!this.isBase64Image(base64Image)) {
      throw new Error('The provided src is not a valid base64 image.');
    }

    const extractedData = this.extractBase64Data(base64Image);
    if (!extractedData) {
      throw new Error('Failed to extract data from base64 image.');
    }

    const { format, data } = extractedData;
    const filename = `image.${format}`;
    const file = this.base64ToFile(data, filename);

    const formData = new FormData();
    formData.append('images', file);

    const response = await this.requestService.postRequest('upload/' + itemId, formData)

    if (response.status != 201) {
      throw new Error('Failed to upload image.');
    }

    return response;
  }

  //Responsável por reconhecer quais imagens foram selecionadas, enviar pro banco e a inserir na lista de imagens da tela
  async onFileSelected(event: any, idResponseField: any, imageList: any, route: string) {
    const files = event.target.files
    let formData = new FormData()

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i])
      }
      let ret: any
      ret = await this.requestService.postRequest('uploadResponseField/' + idResponseField, formData)
      if(ret.status == 200 || ret.status == 201) {
        await this.reloadImageFields(idResponseField, imageList, route)
      }
    }
  }

  //Recarrega a imagem do field
  async reloadImageFields(id: number, imageList: any, route: string){
    let index: number
    index = imageList.findIndex((elemento: any) => elemento.response_id === id);
    imageList[index].images = await this.getImages(id, route)
  }

  //Serviço responsável por pegar as imagens do typefield referente ao item em questão
  async getImages(id: any, route: string): Promise<any> {
    let ret: any
    ret = await this.requestService.getRequest(`${route}/${id}`)
    return ret.data
  }

  //Deleta a imagem da lista na tela e do banco de dados
  async deleteImage(imageID: number, elementID: number = 0, imageList: any) {
    let requestReturnStatus: any
    requestReturnStatus = await this.requestService.deleteRequest("deleteImage", String(imageID))

    if(requestReturnStatus == 200 || requestReturnStatus == 201) {

      const index = imageList.findIndex((elemento: any) => elemento.response_id === elementID);

      if (index !== -1) {
        const imageIndex = imageList[index].images.findIndex((elemento: any) => elemento.id === imageID);
      
        if (imageIndex !== -1) {
          imageList[index].images.splice(imageIndex, 1);
        } 
      } 
    }
  }

  async onPaste(event: ClipboardEvent, idResponseField: any, imageList: any, route: string) {
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            const fileInput = document.querySelector('.file-input') as HTMLInputElement;
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            let formData = new FormData()
            let ret: any

            if (fileInput.files) {   
              formData.append("images", fileInput.files[0])
              ret = await this.requestService.postRequest('uploadResponseField/' + idResponseField, formData)
              if(ret.status == 200 || ret.status == 201) {
                await this.reloadImageFields(idResponseField, imageList, route)
              }
            }
          }
        }
      }
    }
  }
}
