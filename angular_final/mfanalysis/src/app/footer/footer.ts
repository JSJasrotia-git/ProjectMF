import { Component } from '@angular/core';
import { NgIf } from '@angular/common';  // correct import for Angular 20 if directive
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
  imports: [NgIf]  // include new 'if' directive for Angular 20
})
export class Footer {
  textToDisplay: SafeHtml | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  onHomeClick() {
    this.textToDisplay = null;
    //console.log('Home clicked');
  }

  onAboutMeClick() {
    this.textToDisplay = this.sanitizer.bypassSecurityTrustHtml(
      'This is a learning project for me to understand different parameters for Mutual Fund evaluation and supports my technical learning'
    );
    //console.log('About Me clicked');
  }

  onContactUsClick() {
    this.textToDisplay = this.sanitizer.bypassSecurityTrustHtml(
      'Checkout my repo: <a href="https://github.com/JSJasrotia-git" target="_blank" rel="noopener noreferrer">https://github.com/JSJasrotia-git</a>'
    );
    //console.log('Contact Us clicked');
  }

  onCreditClick() {
    this.textToDisplay = this.sanitizer.bypassSecurityTrustHtml(
      'THANKS to team at <a href="https://mfapi.in" target="_blank" rel="noopener noreferrer">mfapi.in</a>, all data shown in this site is from mfapi.in, this helped avoid deploying a JSON server... AND THANKS to team at <a href="https://www.perplexity.ai/" target="_blank" rel="noopener noreferrer">perplexity.ai</a> '
    );
    //console.log('Credits clicked');
  }

  get checktextToDisplay(): boolean {
    return !!this.textToDisplay;
  }
}
