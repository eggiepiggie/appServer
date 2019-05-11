import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //styleUrls: ['../../static/dist/tailwind.css']
})
export class AppComponent {
  title = "Eggie's First Angular App!";
  showLeftPanel : boolean = false;
  showRightPanel : boolean = false;

  toggleLeftPanel() {
    this.showLeftPanel = !this.showLeftPanel;
  }

  toggleRightPanel() {
    this.showRightPanel = !this.showRightPanel;
  }
}
