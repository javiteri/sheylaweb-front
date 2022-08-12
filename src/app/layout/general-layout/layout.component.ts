import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {BreakpointObserver} from '@angular/cdk/layout'
import { Router, RouterLink } from '@angular/router';
import { Menu } from 'src/app/interfaces/IWebData';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

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
      submenu: [ {name: 'Datos Emprsa', url: ''},
      {name: 'Avanzados', url: ''},
      {name: 'Datos Emprsa', url: ''},
      {name: 'Avanzados', url: ''},
      {name: 'Datos Emprsa', url: ''},
      {name: 'Avanzados', url: ''},
      {name: 'Datos Emprsa', url: ''},
      {name: 'Avanzados', url: ''},]
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
      routerLink: '',
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
        {name: 'Datos Emprsa', url: ''},
        {name: 'Avanzados', url: ''},
      ]
    }

  ];


  ngOnInit(): void {
  }

  constructor(private observer: BreakpointObserver,
            private router: Router){}


  ngAfterViewInit(){
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {

      if(res.matches){
        this.sidenav.mode = 'over';
        this.sidenav.close();
      }else{
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }

    });
  }


  logout(){

    localStorage.clear();
    this.router.navigate(['/login']);
  }


  selectMenu(parentMenu: {name: string, routerLink: string; }): void{

    console.log('inside click menu');

    if(parentMenu.routerLink){
      this.router.navigate(['/'+parentMenu.routerLink]);
      console.log('inside router Link');
    }

    this.menus.forEach(menu => {
      if(menu.name !== parentMenu.name){
        menu.active = false;
        console.log(''+menu.name + ' is false');
      }else{
        menu.active = !menu.active;
        console.log(''+menu.name + ' is active');
      }
    })

  }
  
  routerToDest(routerTo: string){ 
    console.log('routerTo: ' + routerTo);
    if(routerTo){
      console.log('inside If: ' + routerTo);
    }
  }


}
