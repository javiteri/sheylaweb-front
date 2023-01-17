export interface VentaImport {
    fechaHora: string;
	documento: string;
	numero: string;
	total: string;
	idUsuario: number;
	cliente: string;
	cc_ruc_pasaporte: string;
	forma_pago: string;
    subtotalIva: number;
    subtotalCero: number;
    valorIva: number;
    listDetalle?: any[];
}