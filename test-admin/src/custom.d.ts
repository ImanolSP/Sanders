// custom.d.ts
declare module 'react-pro-sidebar';
declare module 'jspdf-autotable';
declare module "*.png" {
    const content: string;
    export default content;
  }
  
  declare module "*.jpg" {
    const content: string;
    export default content;
  }
  
  declare module "*.jpeg" {
    const content: string;
    export default content;
  }
  
  declare module "*.gif" {
    const content: string;
    export default content;
  }
  
  declare module "*.svg" {
    const content: string;
    export default content;
  }

  declare module 'react-pro-sidebar' {
    // Aquí puedes añadir tipos específicos si lo deseas, o dejarlo como any
    const content: any;
    export default content;
  }
