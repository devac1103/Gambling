import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Owner } from "../../../shared/owner/owner";
import { TrackService, UserService } from "../../../shared/services.module";
import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: "stake",
  templateUrl: "./stake.html",
  styleUrls: ["../profiles-common.css", "./stake-common.css"],
})
export class StakeComponent {
  isLoading = false;
  upcomingOpen = false;
  resultsOpen = false;
  upcoming: Array<any>;
  results: Array<any>;
  stakeID: number = 0;
  private sub: any;
  name: string;
  weeks: string;
  horseType: string;
  purse: string;

  constructor(private router: Router, private route: ActivatedRoute, private trackService: TrackService, private userService: UserService) {}

  ngOnInit() {
    this.isLoading = true;
    this.sub = this.route.params.subscribe(params => {
       this.stakeID = +params['id'];
       console.log("ID: ", this.stakeID);
       this.trackService.getStakeRace(this.stakeID)
       .subscribe(
         (res) => {
          console.log("RES:", JSON.stringify(res));
          this.name = res.details.name;
          this.weeks = res.details.weeks;
          this.horseType = res.details.horseType;
          this.purse = this.userService.commaSeparateNumber(res.details.finalPurse);
          this.upcoming = res.upcoming;
          this.results = res.results;
          this.isLoading = false;
       },
         (error) => {

           console.log("Error:", JSON.stringify(error));
           this.isLoading = false;
       }
       );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
