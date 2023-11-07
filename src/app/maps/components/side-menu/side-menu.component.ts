import { Component } from '@angular/core';

interface MenuItem{
  name: String; 
  route: String;
}

@Component({
  selector: 'maps-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  public menuItems: MenuItem[]=[
    { route: '/maps/map', name: 'Mapa' },
    { route: '/maps/products', name: 'Productos' },
  ]
}
