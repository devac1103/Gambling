import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { View } from "ui/core/view";
import { ListView } from "ui/list-view";
import { TextField } from "ui/text-field";
import { DriverService, HorseService, RaceService, UserService } from "../../../shared/services.module";
import { Router, NavigationExtras } from "@angular/router";
import { User } from "../../../shared/user/user";
import * as appSettings from "application-settings";

@Component({
  moduleId: module.id,
  selector: "upcoming",
  templateUrl: "./upcoming.html",
  styleUrls: ["../cardList-common.css", "../cardList.css"]
})
export class UpcomingComponent {
  isLoading = false;
  claiming: string;
  buttonEnabled: boolean;
  myID: number;
  claimRaceID = -1;
  claimHorseID = -1;
  raceList: ListView;
  visibleID: number;
  detailID: number;
  races: any;
  card: any;
  detail: Array<Object>;
  @ViewChild("raceListView") raceListView: ElementRef;

  constructor(private raceService: RaceService, private router: Router, private userService: UserService) {
    this.visibleID = -1;
    this.detailID = -1;
    this.buttonEnabled = true;
    this.myID = this.userService.user.id;
  }
  toggleRaceBody(id: number, i: number) {
    if (this.visibleID == id) {
      this.visibleID = -1;
      this.raceList.refresh();
    } else {
      this.raceList.scrollToIndex(i);
      this.visibleID = id;
      this.loadCard(id);
    }
  }
  toggleRaceDetail(race: any) {
    if (this.detailID == race.id) {
      this.detailID = -1;
    } else {
      this.detailID = race.id;
      this.detail = race.entries;
    }
    this.raceList.refresh();
  }
  showRace(id: number) {
    this.router.navigate(["/raceViewer", id]);
  }
  goToHorse(id: number) {
    this.router.navigate(["/horse", id]);
  }
  goToDriver(id: number) {
    this.router.navigate(["/driver", id]);
  }
  goToOwner(id: number) {
    this.router.navigate(["/owner", id]);
  }
  loadCard(id: number) {
    this.raceService.getRaceCard(id)
      .subscribe(
        (res) => {
          this.card = res;
          this.raceList.refresh();
      },
        (error) => {}
      );
  }

  claim() {
    this.buttonEnabled = false;
    this.raceService.claimHorse(this.claimRaceID, this.claimHorseID)
      .subscribe(
        (res) => {
          for(let i=0;i<this.card.length;i++) {
            if (this.card[i].raceID == this.claimRaceID) {
              for (let j=0; j<this.card[i].entries.length; j++) {
                if (this.card[i].entries[j].horseID == this.claimHorseID) {
                  this.card[i].entries[j].claimEntered = this.claimHorseID;
                  this.claiming = null;
                  this.raceList.refresh();
                  this.buttonEnabled = true;
                  return true;
                }
              }
            }
          }
      },
        (error) => {}
      );
  }
  cancel() {
    this.claiming = null;
    this.claimRaceID = -1;
    this.claimHorseID = -1;
    this.raceList.refresh();
  }
  claimHorse(name: string, raceID: number, horseID: number) {
    this.claimRaceID = raceID;
    this.claimHorseID = horseID;
    this.claiming = name;
    this.raceList.refresh();
  }

  viewProgram(id: number) {
    let navigationExtras: NavigationExtras = {
      queryParams: { "id": id }
    };
    this.router.navigate(["/program"], navigationExtras);
  }
  cleanseHistory() {
    let token = appSettings.getString("token");
    let priceNum = appSettings.getNumber("price");
    let programsStr = appSettings.getString("programs");

    if (programsStr) {
      let programObjs = [];
      let programs = JSON.parse(programsStr);
      for (let i = 0; i < programs.length; i++) {
        let storedProgram = appSettings.getString("program" + programs[i]);
        if (storedProgram) {
          let program = JSON.parse(storedProgram);
          let compareWeek = this.userService.week - 2;
          if (program[0].season < this.userService.season) {
            if (program[0].week < 51 || compareWeek > 0) {
              programs.splice(i, 1);
              appSettings.remove("program" + programs[i])
            }
          } else if (program[0].season == this.userService.season && program[0].week < compareWeek) {
            programs.splice(i, 1);
            appSettings.remove("program" + programs[i])
          }
        }
      }
      programsStr = JSON.stringify(programs);
      appSettings.setString("programs", programsStr);
    } else {
      appSettings.clear();
    }
    appSettings.remove("token");
    appSettings.setString("token", token);
    if (priceNum) {
      appSettings.remove("price");
      appSettings.setNumber("price", priceNum);
    }
  }
  ngOnInit() {
    this.isLoading = true;
    this.raceList = <ListView>this.raceListView.nativeElement;
    this.raceService.getUpcoming()
      .subscribe(
        (res) => {
          this.races = res;
          this.cleanseHistory();
          this.isLoading = false;
      },
        (error) => {
          this.isLoading = false;
      }
      );
  }
}
