// src/utiles/tokenCreate.ts

import jwt from 'jsonwebtoken';

/**
 * Creează un token JWT bazat pe datele furnizate
 * @param data - Datele care vor fi stocate în token
 * @returns Promise care rezolvă tokenul JWT generat
 */
export const createToken = async <T extends object>(data: T): Promise<string> => {
    const token = await jwt.sign(
        data, 
        process.env.SECRET as string, 
        {
            expiresIn: '7d'
        }
    );
    
    return token;
};