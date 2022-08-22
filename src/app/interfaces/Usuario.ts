export interface Usuario {
    id: number,
    empresaId: number
    nombre: string,
    telefono: string,
    direccion: string,
    email: string,
    fechaNacimiento: string,
    username: string,
    password: string,
    permisoEscritura: number
}