import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  screen: number = 1;
  img: string = `/assets/images/tutorial/${this.screen}.jpg`;

  constructor() {}

  nextScreen() {
    this.screen++;
    this.img = `/assets/images/tutorial/${this.screen}.jpg`;
  }
}
