import { Component } from "@angular/core";
import { isIOS } from 'platform';
import { topmost } from 'ui/frame';
import *  as purchase from "nativescript-purchase";

@Component({
  selector: "main",
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent {

    constructor() {
      if (isIOS) {
        topmost().ios.controller.navigationBar.barStyle = 1;
      }
      purchase.init(["offandpacing_10k_coins", "offandpacing_50k_coins", "offandpacing_100k_coins", "offandpacing_250k_coins", "offandpacing_1m_coins"]);
    }
}
