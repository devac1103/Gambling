import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { RaceService, UserService } from "../../../shared/services.module";
import { ScrollEventData, ScrollView } from "ui/scroll-view";

@Component({
  selector: "race",
  templateUrl: "partials/program/race/race.html",
  styleUrls: ["partials/program/race/race-common.css", "partials/program/race/race.css"]
})

export class ProgramRaceComponent {
  buttonEnabled: boolean;
  claiming: number = null;
  claimAlert: string;
  myID: number;
  @Input() race: any;
  @Input() mode: number;
  @Output() claimFeedback: EventEmitter<Object> = new EventEmitter();
  scroll: Array<ScrollView>;
  @ViewChild("tableHead") tableHead: ElementRef;
  @ViewChild("tableBody") tableBody: ElementRef;

  constructor(private router: Router, private raceService: RaceService, private userService: UserService) {
    this.buttonEnabled = true;
    this.myID = this.userService.user.id;
  }

  public onScroll(args: ScrollEventData) {
    let tableHeadings = <ScrollView>this.tableHead.nativeElement;
    tableHeadings.scrollToHorizontalOffset(args.scrollX, false);
  }

  claim() {
    this.buttonEnabled = false;
    this.raceService.claimHorse(this.race.id, this.claiming)
      .subscribe(
        (res) => {
          for (let i=0; i<this.race.horses.length; i++) {
            if (this.race.horses[i].horseID == this.claiming) {
              this.race.horses[i].claimEntered = true;
              this.claimFeedback.emit(this.race);
              this.claiming = null;
              this.buttonEnabled = true;
            }
          }
        },
        (error) => {}
      );
  }
  cancel() {
    this.claiming = null;
  }

  claimHorse(horseID: number, ownerID: number, claimEntered: boolean) {
    if (this.race.description.indexOf('Claim') != -1) {
      let errorMsg: string = null;
      let claimAmount = parseInt(this.race.restrictions.substring(0).split("c: ")[1]);

      if (ownerID == this.myID) {
        errorMsg = "You cannot claim your own horse";
      } else if (this.userService.user.coinBalance < claimAmount) {
        errorMsg = "You do not have enough coins for this claim";
      } else if (claimEntered) {
        errorMsg = "You already have a claim on this horse";
      }

      this.claimAlert = errorMsg;
      this.claiming = horseID;

      if (errorMsg) {
        setTimeout(() => {
            this.claiming = null;
        }, 3000);
      }
    }
  }

  goToRace(id: Number) {
    this.router.navigate(["/raceViewer", id]);
  }
  goToHorse(id) {
    this.router.navigate(["/horse/"+id]);
  }
}
