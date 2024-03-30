import { CodigoDistribuidor } from "./CodigoDistribuidor.interface";
import { EmailDistribuidor } from "./EmailDistribuidor.interface";

export interface DistribuidorElement {
    id: number;
    name: string;
    active: boolean;
    companies: number;
    margin: number;
    nif: string;
    type: string;
    phone: string;
    codes: CodigoDistribuidor[];
    emails: EmailDistribuidor[];
  }