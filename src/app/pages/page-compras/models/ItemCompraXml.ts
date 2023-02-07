export interface ItemCompraXml{
    codigoPrincipal: string,
    descripcion: string,
    cantidad: string,
    costoUnitario: string,
    descuento: string,
    total: string,
    iva: string,
    existe: string,
    codigoInterno? : string,
    descripcionInterna? : string,
    exist? : boolean,
    prodId? : number,
}