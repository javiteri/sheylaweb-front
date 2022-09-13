export class Venta{
    venta_id: number;
	venta_empresa_id: number;
	venta_tipo: string;
	venta_001: string;
	venta_002: string; 
	venta_numero: string;
	venta_fecha_hora: string;
	venta_usu_id: number;
	venta_cliente_id: number;
	venta_subtotal_12: string;
	venta_subtotal_0: string;
	venta_valor_iva: string;
	venta_total: string;
	venta_forma_pago: string;
	venta_observaciones: string;
	venta_anulado: number;
	venta_electronica_estado: string;
	venta_electronica_observacion: string;

    constructor(ventaId: number, ventaEmpId: number, ventaTipo: string, venta001: string, venta002: string,
        ventaNum: string, ventaFechaHora: string, ventaUsuId: number, ventaCliId: number, ventaSub12: string,
        ventaSub0: string, ventaValIva: string, ventaTotal: string, ventaFormaPago: string, ventaObs: string,
        ventaAnulado: number, ventaElectrEstado: string, ventaElectObs: string = ""){

        this.venta_id = ventaId;
        this.venta_empresa_id = ventaEmpId;
        this.venta_tipo = ventaTipo;
        this.venta_001 = venta001;
        this.venta_002 = venta002;
        this.venta_numero = ventaNum;
        this.venta_fecha_hora = ventaFechaHora;
        this.venta_usu_id = ventaUsuId;
        this.venta_cliente_id = ventaCliId;
        this.venta_subtotal_12 = ventaSub12;
        this.venta_subtotal_0 = ventaSub0;
        this.venta_valor_iva = ventaValIva;
        this.venta_total = ventaTotal;
        this.venta_forma_pago = ventaFormaPago;
        this.venta_observaciones = ventaObs;
        this.venta_anulado = ventaAnulado;
        this.venta_electronica_estado = ventaElectrEstado;
        this.venta_electronica_observacion = ventaElectObs;
    }
}