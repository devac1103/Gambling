import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TrackService, UserService } from "../../../shared/services.module";

@Component({
  moduleId: module.id,
  selector: "track",
  templateUrl: "track.html",
  styleUrls: ["../profiles-common.css", "track-common.css"],
})
export class TrackComponent {
  isLoading = false;
  loadRecords = false;
  loadStakes = false;
  recordsOpen = false;
  stakesOpen = false;
  driversOpen = false;
  ownersOpen = false;
  private sub: any;
  trackID: number;
  track: any;
  records: Array<any> = null;
  stakes: Array<any> = null;

  constructor(private router: Router, private route: ActivatedRoute, private trackService: TrackService, private userService: UserService) {}

  getGenderString(sex: number, age: number) {
    if (age < 4) {
      return (sex == 0) ? "Colt" : "Filly";
    } else {
      return (sex == 0) ? "Horse" : "Mare";
    }
  }

  openRecords() {
    this.recordsOpen = !this.recordsOpen;
    if (!this.records) {
      this.loadRecords = true;
      this.trackService.getRecords(this.trackID)
      .subscribe(
        (res) => {
          this.records = res;
          this.loadRecords = false;
      },
        (error) => {}
      );
    }
  }
  openStakes() {
    this.stakesOpen = !this.stakesOpen;
    if (!this.stakes) {
      this.loadStakes = true;
      this.trackService.getStakes(this.trackID)
      .subscribe(
        (res) => {
          this.stakes = res;
          this.loadStakes = false;
      },
        (error) => {}
      );
    }
  }

  ngOnInit() {
    this.isLoading = true;
    this.sub = this.route.params.subscribe(params => {
       this.trackID = +params['id'];
       this.track = this.trackService.getTrack(this.trackID);
       this.isLoading = false;
     });
  }
  goToHorse(id) {
    this.router.navigate(["/horse/"+id]);
  }
  goToStakes(id) {
    this.router.navigate(["/stake/"+id]);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
