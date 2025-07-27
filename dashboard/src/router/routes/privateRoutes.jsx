//src/router/routes/privateRoutes.js
import { adminRoutes } from "./adminRoutes";
import  { sellerRoutes } from './sellerRoutes';

export const privateRoutes = [
    ...adminRoutes,
    ...sellerRoutes
]