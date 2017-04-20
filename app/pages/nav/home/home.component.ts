import { Component, ViewChild } from "@angular/core";
import { Horse } from "../../../shared/horse/horse";
import { HorseService } from "../../../shared/services.module";
import { Router } from "@angular/router";
import { DashboardComponent } from "../../../partials/dashboard/dashboard.component";
import * as elementRegistryModule from 'nativescript-angular/element-registry';
elementRegistryModule.registerElement("CardView", () => require("nativescript-cardview").CardView);

@Component({
  moduleId: module.id,
  selector: "home",
  templateUrl: "./home.html",
  styleUrls: ["../nav-common.css", "../nav.css"]
})
export class HomeComponent {
  @ViewChild(DashboardComponent) dash;

  constructor(private router: Router, private horseService: HorseService) {
    this.horseService.getHorsesBadge();
  }

  goTo(route: string) {
    this.dash.update();
    this.router.navigate(["/"+route]);
  }
}
