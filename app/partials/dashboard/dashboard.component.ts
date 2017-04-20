import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../shared/services.module";
import 'rxjs/add/operator/pairwise';

@Component({
  selector: "dashboard",
  templateUrl: "partials/dashboard/dashboard.html",
  styleUrls: ["partials/dashboard/dashboard-common.css", "partials/dashboard/dashboard.css"]
})
export class DashboardComponent {
  username: string;
  coinBalance: string;
  week: number;
  season: number;

  constructor(private router: Router, private userService: UserService) {
    this.username = userService.getUsername();
    this.coinBalance = this.userService.commaSeparateNumber(this.userService.user.coinBalance);
    this.week = userService.getWeek();
    this.season = userService.getSeason();
  }

  update() {
    this.userService.getBalance()
    .subscribe(
      (res) => {
        this.coinBalance = this.userService.commaSeparateNumber(this.userService.user.coinBalance);
      },
      (error) => {}
    );
  }

  goToOwner() {
    let id = this.userService.getID();
    this.router.navigate(["/owner", id]);
  }
  goToPurchase() {
    this.router.navigate(["/purchase"]);
  }
  goToFaq() {
    this.router.navigate(["/faq"]);
  }
  goToNews() {
    this.router.navigate(["/news"]);
  }
}
