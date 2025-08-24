import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-admin-component',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
   imports:[RouterModule],
})
export class AdminComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
