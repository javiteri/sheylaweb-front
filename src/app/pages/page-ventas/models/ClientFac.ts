export class ClienteFactura{
    id: number;
    ciRuc: string;
    nombre: string;
    direccion: string;
    email: string;

    constructor(id: number, ciRuc: string, nombre: string, direccion: string, email: string){
        this.id = id;
        this.ciRuc = ciRuc;
        this.nombre = nombre;
        this.direccion = direccion;
        this.email = email;
    }
}