export class ProveedorFactura{
    id: number;
    ciRuc: string;
    nombre: string;
    direccion: string;
    email: string;
    telefono: string;

    constructor(id: number, ciRuc: string, nombre: string, 
        direccion: string, email: string, telefono: string){
        this.id = id;
        this.ciRuc = ciRuc;
        this.nombre = nombre;
        this.direccion = direccion;
        this.email = email;
        this.telefono = telefono;
    }
}