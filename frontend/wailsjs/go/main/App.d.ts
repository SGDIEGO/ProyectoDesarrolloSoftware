// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {utils} from '../models';
import {dto} from '../models';

export function BibGetAll():Promise<utils.ResponseStr>;

export function BibGetById(arg1:dto.Bibliotecario):Promise<utils.ResponseStr>;

export function CloseSession():Promise<void>;

export function ComGetAll():Promise<utils.ResponseStr>;

export function EstAsignarMulta(arg1:number,arg2:number):Promise<utils.ResponseStr>;

export function EstCreate(arg1:dto.EstudianteDTO):Promise<utils.ResponseStr>;

export function EstDelById(arg1:number):Promise<utils.ResponseStr>;

export function EstGetAll():Promise<utils.ResponseStr>;

export function EstRealizarComentario(arg1:dto.EstudianteComentarioDTO):Promise<utils.ResponseStr>;

export function GetDataSession():Promise<utils.ResponseStr>;

export function LibCreate(arg1:dto.LibroDTO):Promise<utils.ResponseStr>;

export function LibDelById(arg1:number):Promise<utils.ResponseStr>;

export function LibGetAll():Promise<utils.ResponseStr>;

export function MulGetAll():Promise<utils.ResponseStr>;

export function MulGetAllMultas():Promise<utils.ResponseStr>;

export function MulPagarById(arg1:number):Promise<utils.ResponseStr>;

export function OpenBrowser(arg1:string):Promise<void>;

export function PresAsignarMulta(arg1:number,arg2:number):Promise<utils.ResponseStr>;

export function PresCreate(arg1:dto.PrestamoDTO):Promise<utils.ResponseStr>;

export function PresDelById(arg1:number):Promise<utils.ResponseStr>;

export function PresGetAll():Promise<utils.ResponseStr>;

export function PresTerminar(arg1:number):Promise<utils.ResponseStr>;

export function PresVerificar():Promise<utils.ResponseStr>;
