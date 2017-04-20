import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Owner } from "../../../shared/owner/owner";
import { RaceEntry } from "../../../shared/race/raceEntry";
import { RaceResult } from "../../../shared/race/raceResult";
import { OwnerService, UserService } from "../../../shared/services.module";

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: "owner",
  templateUrl: "./owner.html",
  styleUrls: ["../profiles-common.css", "./owner-common.css"]
})
export class OwnerComponent {
  isLoading = false;
  upcomingOpen = false;
  resultsOpen = false;
  horsesOpen = false;
  ownerID: number = 0;
  private sub: any;
  username: string;
  dateJoined: string;
  rankString: string;
  purses: string;
  starts: number;
  wins: number;
  places: number;
  shows: number;
  average: string;
  upcomingRaces: Array<RaceEntry>;
  pastRaces: Array<RaceResult>;
  horses: any;

  constructor(private ownerService: OwnerService, private router: Router, private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.isLoading = true;
    this.sub = this.route.params.subscribe(params => {
       this.ownerID = +params['id'];
       this.ownerService.getOwner(this.ownerID)
       .subscribe(
         (res) => {
           this.username = res.username;
           this.dateJoined = "since " + res.dateJoined;
           this.starts = res.starts;
           this.wins = res.wins;
           this.places = res.places;
           this.shows = res.shows;
           this.average = res.average;
           this.pastRaces = res.pastRaces;
           this.upcomingRaces = res.upcomingRaces;
           this.horses = res.horses;
           this.purses = this.userService.commaSeparateNumber(res.purses);
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

  goToHorse(id: number) {
    this.router.navigate(["/horse/"+id]);
  }
}
