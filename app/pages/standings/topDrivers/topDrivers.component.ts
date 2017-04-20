import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { DriverService, UserService } from "../../../shared/services.module";

@Component({
  moduleId: module.id,
  selector: "top-drivers",
  templateUrl: "./topDrivers.html",
  styleUrls: ["../standings-common.css", "../standings.css"]
})
export class TopDriversComponent {
  isLoading = false;
  range: string;
  type: string;
  drivers: any;

  constructor(private driverService: DriverService, private router: Router, private userService: UserService) {
    this.range = "all";
    this.type = "average";
  }
  setRange(r: string) {
    this.range = r;
    this.sortDrivers();
  }
  setType(t: string) {
    this.type = t;
    this.sortDrivers();
  }
  sortDrivers() {
    if (this.range == "all") {
      if (this.type == "wins") {
        this.drivers.sort(this.sortWins);
      } else if (this.type == "purses") {
        this.drivers.sort(this.sortPurses);
      } else {
        this.drivers.sort(this.sortAverage);
      }
    } else {
      if (this.type == "wins") {
        this.drivers.sort(this.sortSeasonWins);
      } else if (this.type == "purses") {
        this.drivers.sort(this.sortSeasonPurses);
      } else {
        this.drivers.sort(this.sortSeasonAverage);
      }
    }
  }
  sortAverage(a, b) {
    let c = parseFloat(a.average);
    let d = parseFloat(b.average);
    if (c < d) {
      return 1;
    } else if (c > d) {
      return -1;
    }
    return 0;
  }
  sortWins(a, b) {
    let c = parseInt(a.wins);
    let d = parseInt(b.wins);
    if (c < d) {
      return 1;
    } else if (c > d) {
      return -1;
    }
    return 0;
  }
  sortPurses(a, b) {
    let c = parseInt(a.purses);
    let d = parseInt(b.purses);
    if (c < d) {
      return 1;
    } else if (c > d) {
      return -1;
    }
    return 0;
  }
  sortSeasonAverage(a, b) {
    let c = parseFloat(a.seasonAverage);
    let d = parseFloat(b.seasonAverage);
    if (c < d) {
      return 1;
    } else if (c > d) {
      return -1;
    }
    return 0;
  }
  sortSeasonWins(a, b) {
    let c = parseInt(a.seasonWins);
    let d = parseInt(b.seasonWins);
    if (c < d) {
      return 1;
    } else if (c > d) {
      return -1;
    }
    return 0;
  }
  sortSeasonPurses(a, b) {
    let c = parseInt(a.seasonPurses);
    let d = parseInt(b.seasonPurses);
    if (c < d) {
      return 1;
    } else if (c > d) {
      return -1;
    }
    return 0;
  }

  ngOnInit() {
    this.isLoading = true;
    this.driverService.getTopDrivers()
    .subscribe(
      (res) => {
        this.drivers = res;
        this.isLoading = false;
    },
      (error) => {
        this.isLoading = false;
    }
    );
  }

  goToDriver(id) {
    this.router.navigate(["/driver/"+id]);
  }

}
