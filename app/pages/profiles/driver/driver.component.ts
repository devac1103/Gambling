import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Owner } from "../../../shared/owner/owner";
import { RaceEntry } from "../../../shared/race/raceEntry";
import { RaceResult } from "../../../shared/race/raceResult";
import { DriverService } from "../../../shared/services.module";

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: "driver",
  templateUrl: "./driver.html",
  styleUrls: ["../profiles-common.css", "./driver-common.css"]
})
export class DriverComponent {
  isLoading = false;
  upcomingOpen = false;
  resultsOpen = false;
  driverID: number = 0;
  private sub: any;
  name: string;
  age: string;
  bio: string;
  image: string;
  starts: number;
  wins: number;
  places: number;
  shows: number;
  average: string;
  upcomingRaces: Array<RaceEntry>;
  pastRaces: Array<RaceResult>;

  constructor(private driverService: DriverService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isLoading = true;
    this.sub = this.route.params.subscribe(params => {
       this.driverID = +params['id'];
       this.driverService.getDriver(this.driverID)
       .subscribe(
         (res) => {
           this.name = res.name;
           this.age = res.age + " years old";
           this.bio = res.bio;
           this.image = res.image;
           this.starts = res.starts;
           this.wins = res.wins;
           this.places = res.places;
           this.shows = res.shows;
           this.average = res.average;
           this.pastRaces = res.pastRaces;
           this.upcomingRaces = res.upcomingRaces;
           this.isLoading = false;
       },
         (error) => {
           this.isLoading = false;
       }
       );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
