import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { HorseService, UserService } from "../../../shared/services.module";

@Component({
  moduleId: module.id,
  selector: "stakes",
  templateUrl: "./stakes.html",
  styleUrls: ["../standings-common.css", "../standings.css"]
})
export class StakesComponent {
  isLoading = false;
  range: string;
  type: string;
  horses: any;

  constructor(private horseService: HorseService, private userService: UserService, private router: Router) {
    this.range = "2";
    this.type = "colt";
  }
  getGenderString(sex: number, age: number) {
    if (age < 4) {
      return (sex == 0) ? "Colt" : "Filly";
    } else {
      return (sex == 0) ? "Horse" : "Mare";
    }
  }

  two() {
    this.range = "2";
    this.ngOnInit();
  }
  three() {
    this.range = "3";
    this.ngOnInit();
  }
  colt() {
    this.type = "colt";
    this.ngOnInit();
  }
  filly() {
    this.type = "filly";
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
