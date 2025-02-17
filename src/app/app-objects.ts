export class Equipment {
    id: number = 0
    name: string | null = ''
    vendor: string | null = ''
    price: number | null = null
    sap: string | null = ''
    endofsales: string | null = ''
}

export class Model{
    title: string | null = ''
    category_id: number | null = null
}

export class Features {
    id: number = 0
    order: number = 0
    name: string | null = ''
    is_variable: boolean | null = false
    version_id: number | null = null
    response?: string
    status?: string
    response_feature?: [] = []
}

export class Type_fields {
    id: number = 0
    name: string | null = ''
    tag: string | null = ''
}

export class Fields {
    id: number = 0
    title_field: any | null = ''
    standard_value: any = ''
    item_id: number = 0
    type_field_id: number = 0
    feature_id?: number | null
    disabled?: boolean = false
    order_field: number = 0
    response_field?: any
}

export class Items {
    id: number = 0
    order: number = 0
    title: string | null = ''
    description: string | null = ''
    fillable: boolean | null = false
    version_id: number | null = null
    mandatory: boolean | null = false
    status?: string
    response_item?: any
    fields?: any
    is_subitem: boolean | null = false
    father_id: number | null = 0
    fullorder: string | null = ''
}

export class Notebook {
    model_id: number | null = 0
    equipament_id: number | null = 0
    sgd: string | null = ''
    user_responsible_id: number | null = 0
    user_executor_id: number | null = 0
    start_date: string | null = ''
    end_date: string | null = ''
}

export class Response_Features {
    id: number = 0
    response: string | null = ''
    book_id: number | null = 0
    feature_id: number | null = 0
    status: string | null = ''
}

export class Response_Items {
    id: number = 0
    comment: string | null = ''
    book_id: number | null = 0
    item_id: number | null = 0
    status: string | null = ''
}

export class Response_Fields {
    id: number = 0
    response: string = ''
    hash: string | null = ''
    field_id: number | null = 0
    response_item_id: number | null = 0
    images?: any
}

export class Correction_Item {
    ajusted: boolean = false
    color: string = '' 
    id: number = 0
    response_item_id: number = 0
    revision: string = ''
}

export class User {
    username: string | null = ''
    name: string | null = ''
    email: string | null = ''   
    profile: string | null = ''
    company: string | null = ''
}

export class Tickets {
    title: string | null = ''
    category: string | null = ''
    description: string | null = ''   
    userRequester: number = 0
    userResponsible: number | null = null
    start_date: string | null = ''
    end_date: string | null = ''

    user_resp: {
        id: number | null;
        name: string | null;
    }

    user_req: {
        id: number | null;
        name: string | null;
    }

    constructor() {
        this.title = null;
        this.category = null;
        this.description = null;   
        this.userRequester = 0;
        this.userResponsible = null;
        this.start_date = null;
        this.end_date = null;
        this.user_req = {
            id: null,
            name: null
        };
        this.user_resp = {
            id: null,
            name: null
        };
    }
}