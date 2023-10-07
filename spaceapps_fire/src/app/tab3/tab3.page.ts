import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  screens: number[] = new Array(22).fill(null).map((_, i) => i + 1);

  constructor() {}

  image(screen: number) {
    return `/assets/images/tutorial/${screen}.jpg`;
  }
}
