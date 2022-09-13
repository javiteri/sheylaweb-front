export class VentaDetalle{
    ventad_id: number; 
	ventad_venta_id: number;
	ventad_prod_id: number; 
	ventad_cantidad: string; 
	ventad_iva: string;
	ventad_producto: string;
	ventad_vu: string;
	ventad_descuento: string;
	ventad_vt: string;

    constructor(ventaDetId: number, ventaId: number, ventaDetProdId: number, ventaDetCant: string,
        ventaDetIva: string, ventaDetProducName: string, ventaDetValorUnit: string, 
        ventaDetDesc: string, ventaValTot: string){
            this.ventad_id = ventaDetId;
            this.ventad_venta_id = ventaId;
            this.ventad_prod_id = ventaDetProdId;
            this.ventad_cantidad = ventaDetCant;
            this.ventad_iva = ventaDetIva;
            this.ventad_producto = ventaDetProducName;
            this .ventad_vu = ventaDetValorUnit;
            this.ventad_descuento = ventaDetDesc;
            this.ventad_vt = ventaValTot;
    }
}