import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Page } from "ui/page";
import { View } from "ui/core/view";
import { ListView } from "ui/list-view";
import { ActivatedRoute, Router } from '@angular/router';
import { TextField } from "ui/text-field";
import { DriverService, HorseService, UserService } from "../../shared/services.module";
import { Horse } from "../../shared/horse/horse";
import { SelectionListComponent } from "../../partials/selectionList/selectionList.component";
import { User } from "../../shared/user/user";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { DashboardComponent } from "../../partials/dashboard/dashboard.component";
import { PullToRefresh } from "nativescript-pulltorefresh";
import * as appSettings from "application-settings";

@Component({
  selector: "myHorses",
  templateUrl: "pages/myHorses/myHorses.html",
  styleUrls: ["pages/myHorses/myHorses-common.css", "pages/myHorses/myHorses.css"]
})
export class MyHorsesComponent {
  private sub: any;
  reload: boolean;
  isLoading = false;
  loadElig = false;
  showWithdraw = false;
  canSell = true;
  buttonEnabled: boolean;
  currentTab: number = 0;
  visibleID: number;
  enablingStakes: number;
  canAffordStakes = false;
  driverIndex: number = 0;
  horsesList: ListView;
  newPrice: string;
  priceNum: number = null;
  studFee: string;
  saleText: string;
  studFeeNum: number;
  race: any;
  highlighted: number = -1;
  drivers: Array<any> = [];
  races: any;
  horses: Array<Horse> = [];
  selectedDriverID: number;
  selectedDriver: string = "Choose a driver";
  ageFilter: number = -1;
  sexFilter: number = -1;

  @ViewChild("horsesListView") horsesListView: ElementRef;
  @ViewChild(DashboardComponent) dash;

  constructor(private route: ActivatedRoute, private horseService: HorseService, private modalService: ModalDialogService, private driverService: DriverService, private page: Page, private router: Router, private userService: UserService, private viewContainerRef: ViewContainerRef) {
    this.visibleID = -1;
    this.enablingStakes = -1;
    this.buttonEnabled = true;
    this.checkStakes();
    this.newPrice = null;
    this.studFee = null;
  }
  age(age: number) {
    this.ageFilter = age;
    this.horsesList.refresh();
  }
  sex(sex: number) {
    this.sexFilter = sex;
    this.horsesList.refresh();
  }
  filterRaces(option: string, filter: any) {
    if (option == "regular") {
      filter.showReg = !filter.showReg;
    } else if (option == "stakes") {
      filter.showStakes = !filter.showStakes;
    } else if (option == "claiming") {
      filter.showClaiming = !filter.showClaiming;
    }
    if (option) {
      appSettings.setString("filter"+this.visibleID, JSON.stringify(filter));
    }

    this.races.forEach((r) => {
      if (r.restrictions.indexOf('c:') !== -1) {
        r.hide = !filter.showClaiming;
      }
      if (r.restrictions.indexOf('stakes:') !== -1) {
        r.hide = !filter.showStakes;
      }
      if (r.restrictions.indexOf('c:') === -1 && r.restrictions.indexOf('stakes:') === -1) {
        r.hide = !filter.showReg;
      }
    });
    this.horsesList.refresh();
  }
  getGenderString(sex: number, age: number) {
    if (age < 4) {
      return (sex == 0) ? "Colt" : "Filly";
    } else {
      return (sex == 0) ? "Horse" : "Mare";
    }
  }
  gaugeColor(stat: number) {
    if (stat < 15) {
      return "red";
    } else if (stat < 40) {
      return "yellow";
    } else {
      return "green";
    }
  }
  toggleHorseBody(id: number, i: number, horse: any = {}) {
    if (this.visibleID == id) {
      this.visibleID = -1;
    } else {
      this.visibleID = id;
    }
    if (horse.upcomingRaces.length != 0) {
      horse.upcomingRaces.forEach((r) => {
        if (!r.postDrawn) {
          this.showWithdraw = true;
        } else {
          this.showWithdraw = false;
        }
      });
    } else {
      this.showWithdraw = false;
    }
    this.showTab(0);
  }
  enableStakes(id: number, i: number, horse: any = {}) {
    if (this.enablingStakes == id) {
      this.enablingStakes = -1;
    } else {
      this.enablingStakes = id;
    }
    this.horsesList.refresh();
  }
  checkStakes() {
    if (this.userService.user.coinBalance < 100000) {
      this.canAffordStakes = false;
    } else {
      this.canAffordStakes = true;
    }
  }
  stakes() {
    this.buttonEnabled = false;
    this.horseService.stakes(this.enablingStakes)
      .subscribe(
        (res) => {
          this.checkStakes();
          this.enablingStakes = 0;
          this.dash.update();
          this.fetchFromServer();
          this.buttonEnabled = true;
      },
        (error) => {
          this.buttonEnabled = true;
        }
      );
  }

  showTab(num: number, horse: any = {}) {
    if (num == 1) {
      this.loadElig = true;
      this.horseService.getEligibleRaces(this.visibleID)
      .subscribe(
        (res) => {
          this.races = res;
          this.filterRaces("", horse.filter);
          this.loadElig = false;
      },
        (error) => {
        }
      );
    } else if (num == 2) {
      if (horse.salePrice) {
        this.canSell = false;
        this.saleText = horse.name + " is for sale.";
      } else if (horse.upcomingRaces.length && horse.upcomingRaces[0].description.indexOf('Claim') != -1) {
        this.canSell = false;
        this.saleText = "Cannot put up horse for auction when entered in a claiming race.";
      } else {
        this.canSell = true;
      }
    }
    this.currentTab = num;
    this.horsesList.refresh();
  }
  highlight(race: any, i:number, j:number) {
    if (this.highlighted == j) {
      this.showEnterRace(race,i);
    } else {
      this.highlighted = j;
    }
  }
  showEnterRace(race: any, i: number) {
    this.race = race;
    this.drivers = [];
    this.driverService.getDrivers()
      .subscribe(
        (res) => {
          for (let i = 0; i < res.length; i++) {
            let d = res[i];
            let stats = "( " +d.starts+ "-" +d.wins+ "-" +d.places+ "-" +d.shows+ " " +d.average+ " )";
            this.drivers.push({id: d.id, name: d.name, stats: stats});
          }
          this.showTab(4);
      },
        (error) => {}
      );
  }
  sell() {
    this.buttonEnabled = false;
    this.horseService.sell(this.visibleID, 10000000)
      .subscribe(
        (res) => {
          if (res.status == 0) {
            this.fetchFromServer();
          } else {
            this.canSell = false;
            this.saleText = res.message;
            this.horsesList.refresh();
          }
          this.buttonEnabled = true;
      },
        (error) => {
          this.buttonEnabled = true;
        }
      );
  }
  cancelSale() {
    this.buttonEnabled = false;
    this.newPrice = null;
    this.sell();
  }
  retire() {
    this.buttonEnabled = false;
    this.horseService.retire(this.visibleID)
      .subscribe(
        (res) => {
          this.fetchFromServer();
          this.buttonEnabled = true;
      },
        (error) => {
          this.buttonEnabled = true;
        }
      );
  }
  enterRace(raceID: number) {
    if (this.selectedDriver != "Choose a driver" && this.selectedDriver != "Must choose a driver") {
      this.buttonEnabled = false;
      this.horseService.enterRace(this.visibleID, raceID, this.selectedDriverID)
        .subscribe(
          (res) => {
            this.showWithdraw = true;
            this.fetchFromServer();
            this.showTab(0);
            this.buttonEnabled = true;
        },
          (error) => {
            this.buttonEnabled = true;
          }
        );
    } else {
      this.selectedDriver = "Must choose a driver";
    }
  }
  withdraw(entryID: number) {
    this.buttonEnabled = false;
    this.horseService.withdraw(entryID)
    .subscribe(
      (res) => {
        this.showWithdraw = false;
        this.fetchFromServer();
        this.buttonEnabled = true;
    },
      (error) => {
        this.buttonEnabled = true;
      }
    );
  }
  public templateSelector = (item: any, index: number, items: any) => {
    if (item.retired == null) {
      return "buy-horse";
    }
    return item.retired == 0 ? "racing-horse" : "retired-horse";
  }
  public pickDriver() {
    let options: ModalDialogOptions = {
      context: { items: 'Drivers', list: this.drivers },
      viewContainerRef: this.viewContainerRef
    };
    this.modalService.showModal(SelectionListComponent, options)
    .then((dialogResult) => {
      this.selectedDriver = dialogResult.name;
      this.selectedDriverID = dialogResult.id;
      this.horsesList.refresh();
    });
  }
  fetchFromServer() {
    this.horseService.getMyHorses()
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

  refreshMe(args: any) {
    setTimeout(() => {
        this.fetchFromServer();
        (<PullToRefresh>args.object).refreshing = false;
    }, 2000);
  }

  ngOnInit() {
    this.isLoading = true;
    this.horsesList = <ListView>this.horsesListView.nativeElement;
    this.sub = this.route.params.subscribe(params => {
      this.reload = +params['reload'] == 1;
    });
    if (!this.horseService.myHorses || this.reload) {
      this.fetchFromServer();
    } else {
      this.horses = this.horseService.myHorses;
      this.isLoading = false;
    }
  }
  goToHorse(id) {
    this.router.navigate(["/horse/"+id]);
  }
  goToBuyHorse(id) {
    this.router.navigate(["/buyhorse"]);
  }
}
