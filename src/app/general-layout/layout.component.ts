import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import {BreakpointObserver} from '@angular/cdk/layout'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  ngOnInit(): void {
  }

  constructor(private observer: BreakpointObserver){}


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

}
