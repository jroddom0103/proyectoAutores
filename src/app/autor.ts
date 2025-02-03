export interface Autor {
    nombreCompleto: string;
    lugarNacimiento: string;
    fechaNacimiento: Date;
    fechaDefuncion: Date | null;
    obrasNotables: string;  
    imagenURL: string;
}