import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from "@angular/router";

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  constructor(private router: Router) {}
  textToDisplay: string = '';
  
  onHomeClick() {
    this.textToDisplay = '';
  }
  onAboutMeClick() {
    this.textToDisplay = 'This is a learning project for me to understand different parameters for Mutual Fund evaluation and supports my technical learning)';
  }

  onContactUsClick() {
    this.textToDisplay = 'Checkout my repo: https://github.com/JSJasrotia-git';
  }

  get checktextToDisplay() {
    if(this.textToDisplay === '') {
      return false;
    }else {
    return true
  }
}
}
