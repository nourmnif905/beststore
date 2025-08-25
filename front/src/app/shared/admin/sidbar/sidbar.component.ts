import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidbar',
  templateUrl: './sidbar.component.html',
  styleUrls: ['./sidbar.component.scss'],
  imports:[RouterModule]
})
export class SidbarComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
