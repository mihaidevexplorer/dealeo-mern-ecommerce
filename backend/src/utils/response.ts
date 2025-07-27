// src/utiles/response.ts

import { Response } from 'express';

/**
 * Funcție pentru returnarea unui răspuns standard în format JSON
 * @param res - Obiectul de răspuns Express
 * @param code - Codul de stare HTTP
 * @param data - Datele care vor fi trimise în format JSON
 * @returns Răspunsul Express cu codul de stare și datele specificate
 */
export const responseReturn = (res: Response, code: number, data: any): Response => {
    return res.status(code).json(data);
};