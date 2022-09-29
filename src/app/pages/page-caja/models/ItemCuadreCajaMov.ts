export interface ItemCuadreCajaMov{
    tipoMov: string;
    detalle: string;
    cantidad: string;
    fechaHora: string;
}


export interface ItemCuadreCajaWithDetalle{
    tipo: string;
    grupo: string;
    monto : string;
    listDetalle: DetalleCuadreCajaItem[]
}

interface DetalleCuadreCajaItem{
    tipomov: string,
    detalle: string,
    cantidad : string,
    fecha: string
}