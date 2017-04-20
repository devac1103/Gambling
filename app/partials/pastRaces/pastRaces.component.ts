import { Component, Input } from "@angular/core";
import { Router } from '@angular/router';
import { RaceResult } from "../../shared/race/raceResult";

@Component({
  selector: "past-races",
  templateUrl: "partials/pastRaces/pastRaces.html",
  styleUrls: ["partials/pastRaces/pastRaces-common.css", "partials/pastRaces/pastRaces.css"]
})
export class PastRacesComponent {
  @Input() races: Array<RaceResult>;
  @Input() mode: number;
  
  constructor(private router: Router) {}

  goToRace(id: Number) {
    this.router.navigate(["/raceViewer", id]);
  }
}
