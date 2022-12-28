export class ItemListaProforma{
    id: number;
    fechaHora: string;
	documento: string;
	numero: string;
	total: string;
	usuario: string; 
	cliente: string;
	cc_ruc_pasaporte: string;
	forma_pago: string;
	Observaciones: string;
    anulado: number;
    subtotalIva: number = 0;
    subtotalCero: number= 0;
    valorIva: number= 0;

    constructor(id: number,fechaHora: string, documento: string, numero: string, total: string, usuario: string,
        cliente: string, cc_ruc_pasaporte: string, formapago: string, observaciones: string,
        anulado: number, subtotalIva?: number, subtotalCero?: number, valorIva?: number){

            this.id = id;
            this.fechaHora = fechaHora;
            this.documento = documento;
            this.numero = numero;
            this.total = total;
            this.usuario = usuario;
            this.cliente = cliente;
            this.cc_ruc_pasaporte = cc_ruc_pasaporte;
            this.forma_pago = formapago;
            this.Observaciones = observaciones;
            this.anulado = anulado;
            this.subtotalIva = subtotalIva ? subtotalIva : 0;
            this.subtotalCero = subtotalCero ? subtotalCero : 0;
            this.valorIva = valorIva ? valorIva : 0;
    }
}