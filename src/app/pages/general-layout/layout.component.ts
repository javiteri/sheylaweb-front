import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import {BreakpointObserver} from '@angular/cdk/layout'
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Menu, TokenValidate } from 'src/app/interfaces/IWebData';
import { DataStoreService } from 'src/app/services/DataStore.Service';
import { DataStoreGlobalModel } from 'src/app/interfaces/DataStoreGlobalModel';
import { filter } from 'rxjs';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  idEmpresa: number = 0;
  rucEmpresa: string = '';

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild(MatSidenavContent) sidenavcontent!: MatSidenavContent;
  
  menus: Menu[] = [
    {
      name: 'Dashboard',
      matIcon: 'dashboard',
      active: false,
      routerLink: '',
      submenu: []
    },
    {
      name: 'Clientes',
      matIcon: 'people',
      active: false,
      routerLink: '/clientes',
      submenu: [ ]
    },
    {
      name: 'Inventario',
      matIcon: 'shopping_bag',
      active: false,
      routerLink: '/inventario',
      submenu: []
    }
    ,
    {
      name: 'Ventas',
      matIcon: 'receipt_long',
      active: false,
      routerLink: '/ventas',
      submenu: []
    }
    ,
    {
      name: 'Proveedores',
      matIcon: 'local_shipping',
      active: false,
      routerLink: '/proveedores',
      submenu: []
    },
    {
      name: 'Compras',
      matIcon: 'shopping_cart',
      active: false,
      routerLink: '/compras',
      submenu: []
    },
    {
      name: 'Configurar',
      matIcon: 'settings',
      active: false,
      routerLink: '',
      submenu: [
        {name: 'Datos Empresa', url: 'infoempresa'},
        {name: 'Usuarios', url: 'usuarios'},
        {name: 'Avanzados', url: ''},
      ]
    }

  ];

  closeDrawer = false;
  //dataUser
  dataUser: any;
  tokenValidate!: TokenValidate;

  constructor(private observer: BreakpointObserver,
    private router: Router,
    private dataStoreService: DataStoreService,
    public ref: ChangeDetectorRef){
    }


  ngOnInit(): void {

    this.router.events
        // For newer versions or rxjs use a pipe on the filter:
         .pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
           this.sidenavcontent.getElementRef().nativeElement.scrollTop = 0;
          });
  }

  ngAfterViewInit(){
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {

      if(res.matches){
        this.sidenav.mode = 'over';
        this.sidenav.close();
        this.closeDrawer = true;
      }else{
        this.sidenav.mode = 'side';
        this.sidenav.open();
        this.closeDrawer = false;
      }
      this.ref.detectChanges();

    });
  }


  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  selectMenu(parentMenu: {name: string, routerLink: string; }): void{

    if(parentMenu.routerLink){
      this.router.navigate(['/'+parentMenu.routerLink]);

      if(this.closeDrawer){
        this.sidenav.mode = 'over';
        this.sidenav.close();
        this.ref.detectChanges();
      }
    }

    this.menus.forEach(menu => {
      if(menu.name !== parentMenu.name){
        menu.active = false;
      }else{
        menu.active = !menu.active;
      }
    })

    
  }

  selectSubmenu(submenu: any): void {
    if(submenu.url){
      this.router.navigate(['/'+submenu.url]);

      if(this.closeDrawer){
        this.sidenav.mode = 'over';
        this.sidenav.close();
        this.ref.detectChanges();
      }
  
    }
  }


}
