/// <reference types="vite/client" />

// Pentru importuri CSS
declare module '*.css' {
    const classes: { [key: string]: string };
    export default classes;
  }
  
  // Pentru importuri de module CSS
  declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }
  
  // Pentru importuri de imagini
  declare module '*.png';
  declare module '*.svg';
  declare module '*.jpg';
  declare module '*.jpeg';
  declare module '*.gif';
  declare module '*.webp';
  
  // Dacă folosești importuri specifice componentelor care nu au tipuri definite
  declare module '*.js';
  declare module '*.jsx';