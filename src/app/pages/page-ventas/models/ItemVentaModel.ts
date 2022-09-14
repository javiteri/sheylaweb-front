export class ItemListaVenta{
    fechaHora: string;
	documento: string;
	numero: string;
	total: string;
	usuario: string; 
	cliente: string;
	cc_ruc_pasaporte: string;
	forma_pago: string;
	Observaciones: string;

    constructor(fechaHora: string, documento: string, numero: string, total: string, usuario: string,
        cliente: string, cc_ruc_pasaporte: string, formapago: string, observaciones: string){

            this.fechaHora = fechaHora;
            this.documento = documento;
            this.numero = numero;
            this.total = total;
            this.usuario = usuario;
            this.cliente = cliente;
            this.cc_ruc_pasaporte = cc_ruc_pasaporte;
            this.forma_pago = formapago;
            this.Observaciones = observaciones;
    }
}