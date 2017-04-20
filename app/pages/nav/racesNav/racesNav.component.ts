import { Component, ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import { DashboardComponent } from "../../../partials/dashboard/dashboard.component";

@Component({
  moduleId: module.id,
  selector: "racesNav",
  templateUrl: "./racesNav.html",
  styleUrls: ["../nav-common.css", "../nav.css"]
})
export class RacesNavComponent {
  @ViewChild(DashboardComponent) dash;

  constructor(private router: Router) {}

  goTo(route: string) {
    this.dash.update();
    this.router.navigate(["/"+route]);
  }
}
