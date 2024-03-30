import { CodigoDistribuidor } from "./CodigoDistribuidor.interface";

export interface ClienteElement {
    id: number;
    nombre: string;
    versionActual: string;
    activo: boolean;
    fechaAlta: string;
    codigoPromocional: string;
    nif: string;
    billing: string;
    empleados: number;
    fechaBaja: string;
    referenciaId: string;
    telefono: string;
    codigo: CodigoDistribuidor;
    // emails: EmailDistribuidor[];
  }