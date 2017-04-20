import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { RaceService } from "../../shared/services.module";
import * as appSettings from "application-settings";

@Component({
  selector: "program",
  templateUrl: "pages/program/program.html",
  styleUrls: ["pages/program/program-common.css", "pages/program/program.css"],
})
export class ProgramComponent {
  isLoading = false;
  id: number;
  races: any = {};
  raceToShow: number;
  private sub: any;

  constructor(private router: Router, private raceService: RaceService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.id = params["id"];
    });
    this.raceToShow = 0;
  }
  goToRace(num: number) {
    this.raceToShow = num;
  }
  generateProgram() {
    this.raceService.getProgram(this.id)
      .subscribe(
        (res) => {
          if (res) {
            this.races = res;
            this.save();
          } else {
            this.isLoading = false;
            alert("Oops, something went wrong.")
          }
      },
        (error) => {
          this.isLoading = false;
          alert("Oops, something went wrong.")
        }
      );
  }
  claimEntered (args: any) {
    this.races[this.raceToShow] = args;
    this.save();
  }
  save() {
    let programs = [];
    let storedPrograms = appSettings.getString("programs");
    if (storedPrograms) {
      programs = JSON.parse(storedPrograms);
    }
    programs.push(this.id);
    storedPrograms = JSON.stringify(programs);
    appSettings.setString("programs", storedPrograms);

    let storedProgram = JSON.stringify(this.races);
    appSettings.setString("program"+this.id, storedProgram);
    this.isLoading = false;
  }
  ngOnInit() {
    this.isLoading = true;
    let storedProgram = appSettings.getString("program"+this.id);
    if (!storedProgram) {
      this.generateProgram();
    } else {
      this.races = JSON.parse(storedProgram);
      this.isLoading = false;
    }
  }
}
