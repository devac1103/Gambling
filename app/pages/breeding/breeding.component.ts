import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Page } from "ui/page";
import { View } from "ui/core/view";
import { ListView } from "ui/list-view";
import { Router } from '@angular/router';
import { TextField } from "ui/text-field";
import { DriverService, HorseService, UserService } from "../../shared/services.module";
import { Horse } from "../../shared/horse/horse";
import { SelectionListComponent } from "../../partials/selectionList/selectionList.component";
import { User } from "../../shared/user/user";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { DashboardComponent } from "../../partials/dashboard/dashboard.component";
import { PullToRefresh } from "nativescript-pulltorefresh";

@Component({
  selector: "breeding",
  templateUrl: "pages/breeding/breeding.html",
  styleUrls: ["pages/breeding/breeding-common.css", "pages/breeding/breeding.css"]
})
export class BreedingComponent {
  enabled: boolean;
  isLoading = false;
  callingServer = false;
  canAfford: boolean;
  buttonEnabled: boolean;
  affordRegister: boolean;
  currentTab: number = 0;
  visibleID: number;
  newPrice: string;
  priceNum: number = null;
  studFee: string;
  studFeeNum: number;
  errorText: string;
  yearlingName: string;
  race: any;
  sires: Array<any> = [];
  races: any;
  horses: Array<Horse> = [];
  selectedSireID: number;
  selectedSire: string = "Choose a sire";

  @ViewChild("horsesListView") horsesListView: ElementRef;
  @ViewChild(DashboardComponent) dash;

  constructor(private horseService: HorseService, private modalService: ModalDialogService, private driverService: DriverService, private page: Page, private router: Router, private userService: UserService, private viewContainerRef: ViewContainerRef) {
    // router.events.subscribe((val) => { this.ngOnInit(); });
    this.visibleID = 0;
    this.newPrice = null;
    this.studFee = null;
    this.buttonEnabled = true;
    this.errorText = "This name can be changed until the horse reaches 2 years old."
    this.yearlingName = null;
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
    let horsesListView = <ListView>this.horsesListView.nativeElement;
    this.yearlingName = null;
    this.errorText = "This name can be changed until the horse reaches 2 years old.";
    if (this.visibleID == id) {
      this.visibleID = 0;
    } else {
      this.visibleID = id;
    }
    if (horse.studFee && horse.studFee != 0) {
      this.studFee = this.userService.commaSeparateNumber(horse.studFee);
    } else {
      this.studFee = null;
    }
    this.showTab(0);
  }
  checkBalance() {
    if (this.userService.user.coinBalance < 1000000) {
      this.canAfford = false;
    } else {
      this.canAfford = true;
    }
  }
  register() {
    this.buttonEnabled = false;
    let horsesListView = <ListView>this.horsesListView.nativeElement;
    this.callingServer = true;
    this.horseService.register(this.visibleID)
      .subscribe(
        (res) => {
          this.fetchFromServer();
          this.dash.update();
          this.callingServer = false;
          this.buttonEnabled = true;
        },
        (error) => {}
      );
  }
  retire() {
    this.buttonEnabled = false;
    this.horseService.retire(this.visibleID)
      .subscribe(
        (res) => {
          this.fetchFromServer();
          this.buttonEnabled = true;
      },
        (error) => {}
      );
  }
  enable() {
    this.buttonEnabled = false;
    this.userService.enableBreeding()
    .subscribe(
      (res) => {
        this.enabled = true;
        this.dash.update();
        this.ngOnInit();
        this.buttonEnabled = true;
    },
      (error) => {}
    );
  }

  showTab(num: number, price: number = null) {
    let horsesListView = <ListView>this.horsesListView.nativeElement;
    if (num == 3) {
      this.affordRegister = this.userService.user.coinBalance >= 200000;
    }
    if (price) {
      this.newPrice = this.userService.commaSeparateNumber(price);
    } else {
      this.newPrice = null;
    }
    this.currentTab = num;
    horsesListView.refresh();
  }
  sell() {
    this.buttonEnabled = false;
    this.horseService.sell(this.visibleID, 10000000)
      .subscribe(
        (res) => {
          this.fetchFromServer();
          this.buttonEnabled = true;
      },
        (error) => {}
      );
  }
  breed() {
    this.buttonEnabled = false;
    this.horseService.breed(this.selectedSireID, this.visibleID)
      .subscribe(
        (res) => {
          this.dash.update();
          this.fetchFromServer();
          this.buttonEnabled = true;
      },
        (error) => {}
      );
  }
  cancelSale() {
    this.newPrice = null;
    this.sell();
  }
  changeFee() {
    this.buttonEnabled = false;
    let horsesListView = <ListView>this.horsesListView.nativeElement;

    if (this.studFee) {
      this.studFeeNum = parseInt(this.studFee.replace(/\D/g,''));
    } else {
      this.studFeeNum = 0;
    }

    this.horseService.changeFee(this.visibleID, this.studFeeNum)
      .subscribe(
        (res) => {
          if (this.studFee) {
            this.studFee = this.userService.commaSeparateNumber(this.studFeeNum);
          }
          this.dash.update();
          this.fetchFromServer();
          this.buttonEnabled = true;
      },
        (error) => {}
      );
  }
  changeName() {
    this.buttonEnabled = false;
    let horsesListView = <ListView>this.horsesListView.nativeElement;
    if (this.yearlingName.length < 3) {
      this.errorText = "Horse name must be at least 3 characters.";
      horsesListView.refresh();
      this.buttonEnabled = true;
    } else if (/^[a-zA-Z0-9- ]*$/.test(this.yearlingName) == false) {
      this.errorText = "Name may not contain special characters.";
      horsesListView.refresh();
      this.buttonEnabled = true;
    } else {
      this.callingServer = true;
      this.horseService.changeName(this.visibleID, this.yearlingName)
        .subscribe(
          (res) => {
            if (res.status != 0) {
              this.errorText = "Sorry, that name is already in use.";
              horsesListView.refresh();
            } else {
              this.visibleID = 0;
              this.fetchFromServer();
            }
            this.callingServer = false;
            this.buttonEnabled = true;
          },
          (error) => {}
        );
    }
  }
  public templateSelector = (item: any, index: number, items: any) => {
    if (item.retired == 1) {
      return "retired";
    }
    return "yearling";
  }
  public pickSire() {
    let horsesListView = <ListView>this.horsesListView.nativeElement;
    this.sires = [];
    this.horseService.getSires()
      .subscribe(
        (res) => {
          this.sires = res;
          let options: ModalDialogOptions = {
            context: { items: 'Sires', list: this.sires },
            viewContainerRef: this.viewContainerRef
          };
          this.modalService.showModal(SelectionListComponent, options)
          .then((dialogResult) => {
            this.selectedSire = dialogResult.name;
            this.selectedSireID = dialogResult.id;
            horsesListView.refresh();
          });
      },
        (error) => {}
      );
  }
  fetchFromServer() {
    this.horseService.getBreedingHorses()
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
    this.enabled = false;
    this.enabled = this.userService.user.breedingEnabled == 1 ? true : false;
    if (!this.enabled) {
      this.checkBalance();
    }
    if (!this.horseService.breedingHorses) {
      this.fetchFromServer();
    } else {
      this.horses = this.horseService.breedingHorses;
      this.isLoading = false;
    }
  }
  goToHorse(id) {
    this.router.navigate(["/horse/"+id]);
  }
  goHome() {
    this.router.navigate(["/home"]);
  }
}
