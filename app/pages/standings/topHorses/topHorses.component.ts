import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { HorseService, UserService } from "../../../shared/services.module";

@Component({
  moduleId: module.id,
  selector: "top-horses",
  templateUrl: "./topHorses.html",
  styleUrls: ["../standings-common.css", "../standings.css"]
})
export class TopHorsesComponent {
  isLoading = false;
  range: string;
  type: string;
  horses: any;

  constructor(private horseService: HorseService, private userService: UserService, private router: Router) {
    this.range = "all";
    this.type = "wins";
  }
  getGenderString(sex: number, age: number) {
    if (age < 4) {
      return (sex == 0) ? "Colt" : "Filly";
    } else {
      return (sex == 0) ? "Horse" : "Mare";
    }
  }

  all() {
    this.range = "all";
    this.ngOnInit();
  }
  current() {
    this.range = "current";
    this.ngOnInit();
  }
  wins() {
    this.type = "wins";
    this.ngOnInit();
  }
  purses() {
    this.type = "purses";
    this.ngOnInit();
  }

  ngOnInit() {
    this.isLoading = true;
    this.horses = [];
    this.horseService.getTopHorses(this.range, this.type)
    .subscribe(
      (res) => {
        this.horses = res;
        this.isLoading = false;
    },
      (error) => {
        this.isLoading = false;
    }
    );
  }

  goToHorse(id) {
    this.router.navigate(["/horse/"+id]);
  }
  goToOwner(id) {
    this.router.navigate(["/owner/"+id]);
  }
}
