export interface TokenValidate {
    token: string;
    expire: Date;
}

export type Menu = {
    name: string,
    matIcon: string,
    active: boolean,
    routerLink: string,
    submenu: { name: string, url: string, parametros: any[] }[]
  }
