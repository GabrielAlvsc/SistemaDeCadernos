import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})

// Classe de serviço para os métodos o ItemsComponent
export class ItemService {

  constructor(
    private requestService: RequestService
  ) { }

  // Adiciona um novo field para para a array de fields
  addFields(id: number, maximumOrder: number, fields: any) {
    let field = {
      "id": 0,
      "title_field": "",
      "standard_value": "",
      "item_id": 0,
      "type_field_id": id,
      "order_field": maximumOrder
    }
    if (id === 3) {
      field.standard_value = '.'
    }
    fields.push(field)
    return fields
  }

  //Solicita as imagens ao servidor
  async getImages(itemId: number) {
    const response = await this.requestService.getRequest('images/' + itemId)
    return response.data
  }

  //Salva as imagens
  async onFileSelected(files: any, itemId: number) {
    let formData = new FormData()

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i])
    }

    await this.requestService.postRequest('upload/' + itemId, formData)
  }

  //Salva as informações de cada campo no banco
  async updateFields(fields: any, variableFeatures: any, itemId: number) {
    let fieldBody: any
    let response: any
    for (let field of fields) {
      //Valida se o campo é do tipo característica, se for o valor do title_field será correspondente ao nome da feature variável relacionada
      const feature = variableFeatures.find((feature: any) => feature.id == field.title_field)
      switch (field.id) {
        case 0:
          if (field.type_field_id === 5) {
            fieldBody = {
              "title_field": feature.name,
              "standard_value": field.standard_value,
              "item_id": itemId,
              "type_field_id": field.type_field_id,
              "order_field": field.order_field
            }

            response = await this.requestService.postRequest('field', fieldBody)
            let fieldId = response.data.id
            let featureBody = {
              "feature_id": Number(field.title_field)
            }

            await this.requestService.patchRequest('field', fieldId, featureBody)
          } else {
            fieldBody = {
              "title_field": field.title_field,
              "standard_value": field.standard_value,
              "item_id": itemId,
              "type_field_id": field.type_field_id,
              "order_field": field.order_field
            }
            response = await this.requestService.postRequest('field', fieldBody)
          }
          break

        default:
          if (field.type_field_id === 5) {
            field.feature_id = Number(field.title_field)
            field.title_field = feature.name
          }

          await this.requestService.patchRequest('field', String(field.id), field)
      }
    }
  }

  async deleteField(fields: any, i: number) {
    if(fields[i].id === 0) {
      fields.splice(i, 1)
    } else {
      const response = await this.requestService.deleteRequest('field', String(fields[i].id))
      if(response == 200 || response == 201) {
        fields.splice(i, 1)
      }
    }

    return fields
  }

  async deleteImage(images: any, i: number) {
    const imageId = images[i].id
    const response = await this.requestService.deleteRequest('deleteImage', String(imageId))
    if(response == 200 || response == 201) {
      images.splice(i, 1)
    }
    return images
  }

  // Ordena os campos de acordo com a seta escolhida
  async setOrder(currentIndex: number, direction: string, dataSource: any) {

    let targetIndex
    let currentOrder
    let targetOrder

    switch (direction) {

      case 'up': targetIndex = currentIndex - 1
        break

      case 'down': targetIndex = currentIndex + 1
        break
    }

    // O atributo order_field do campo muda de acordo com a posição anterior e alvo
    if (targetIndex! >= 0 && targetIndex! < dataSource.length) {
      currentOrder = dataSource[currentIndex].order_field
      targetOrder = dataSource[targetIndex!].order_field

      let body = {
        id0: dataSource[currentIndex].id,
        id1: dataSource[targetIndex!].id,
        order0: dataSource[currentIndex].order_field,
        order1: dataSource[targetIndex!].order_field
      }

      let response = await this.requestService.postRequest('fieldSwapOrders', body)
      if (response.status == 200 || response.status == 201) { 
        dataSource[currentIndex].order_field = targetOrder
        dataSource[targetIndex!].order_field = currentOrder
        return this.sortOrder(dataSource)
      }
    }
    return dataSource
  }

  //Ordena os dados de forma crescente
  sortOrder(list: any) {
    return list.sort((a: any, b: any) => {
      if (a.order_field < b.order_field) return -1;
      if (a.order_field > b.order_field) return 1;
      return 0;
    });
  }

  //Define as características variáveis e resgata todos os campos da versão atual do modelo
  async setVariableFeatures(versionId: number, features: any) {
    const response = await this.requestService.getRequest(`fieldsVersion/${versionId}`)
    const fieldsInVersion = response.data

    let variableFeatures = features.filter((feature: any) => feature.is_variable == true)
    variableFeatures.sort((a: any, b: any) => a.id - b.id)

    //Valida se algum há algum campo do tipo característica para desabilitar tal característica da array variableFeatures
    fieldsInVersion.forEach((field: any) => {
      const featureId = field.feature_id
      const featureIndex = variableFeatures.findIndex((variableFeature: any) => variableFeature.id == featureId)
      if (featureIndex !== -1) {
        variableFeatures[featureIndex].disabled = true
      }
    })
    return variableFeatures
  }

  //Altera a visibilidade da característica variável caso ela tenha sido escolhida ou trocada
  changeFeatureVisibility(i: number, variableFeatures: any, previousValue: number, fields: any) {
    let featureIndex = variableFeatures.findIndex((feature: any) => feature.id === previousValue)
    if (featureIndex !== -1) {
      variableFeatures[featureIndex].disabled = false
    }

    featureIndex = variableFeatures.findIndex((feature: any) => feature.id === fields[i].title_field)
    if (featureIndex !== -1) {
      variableFeatures[featureIndex].disabled = true
    }
    return variableFeatures
  }
}
