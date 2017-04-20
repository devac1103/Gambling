import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { RaceEntry } from "../../shared/race/raceEntry";
import { UserService } from "../../shared/services.module";

@Component({
  selector: "upcoming-races",
  templateUrl: "partials/upcomingRaces/upcomingRaces.html",
  styleUrls: ["partials/upcomingRaces/upcomingRaces-common.css", "partials/upcomingRaces/upcomingRaces.css"]
})
export class UpcomingRacesComponent {
  @Input()
  races: Array<RaceEntry>;

  constructor(private userService: UserService) {}
}
