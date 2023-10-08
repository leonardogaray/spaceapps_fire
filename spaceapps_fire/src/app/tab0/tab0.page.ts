import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab0',
  templateUrl: 'tab0.page.html',
  styleUrls: ['tab0.page.scss']
})
export class Tab0Page {

  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigate(['/tabs/tab3']);
    }, 5000);
  }

}
