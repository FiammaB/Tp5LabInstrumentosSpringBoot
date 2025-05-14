export class Usuario {
    id: number;
    nombreUsuario: string;
    rol: string;
    constructor(id: number, nombreUsuario: string, rol: string) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
    }
}
// Interfaz para la estructura de la solicitud de login
export interface LoginPayload {
    nombreUsuario: string;
    clave: string;
}