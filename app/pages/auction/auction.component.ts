import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Page } from "ui/page";
import { View } from "ui/core/view";
import { Router } from '@angular/router';
import { ListView } from "ui/list-view";
import { TextField } from "ui/text-field";
import { DashboardComponent } from "../../partials/dashboard/dashboard.component";
import { HorseService, UserService } from "../../shared/services.module";
import { Horse } from "../../shared/horse/horse";
import { User } from "../../shared/user/user";
import { PullToRefresh } from "nativescript-pulltorefresh";

@Component({
  moduleId: module.id,
  selector: "auction",
  templateUrl: "./auction.html",
  styleUrls: ["./auction-common.css", "./auction.css"]
})
export class AuctionComponent {
  buttonEnabled: boolean;
  isLoading = false;
  buying: number;
  error: string;
  horses: Array<Horse> = [];
  newBid: string;
  myBidNum: number;
  ageFilter: number = -1;
  sexFilter: number = -1;

  @ViewChild("horsesListView") horsesListView: ElementRef;
  @ViewChild(DashboardComponent) dash;

  constructor(private horseService: HorseService, private router: Router, private userService: UserService, private page: Page,) {
    this.buying = -1;
    this.error = "";
    this.buttonEnabled = true;
  }
  getGenderString(sex: number, age: number) {
    if (age < 4) {
      return (sex == 0) ? "Colt" : "Filly";
    } else {
      return (sex == 0) ? "Horse" : "Mare";
    }
  }
  public templateSelector = (item: any, index: number, items: any) => {
    if ((item.age == this.ageFilter || this.ageFilter == -1) && (item.sex == this.sexFilter || this.sexFilter == -1)) {
      return this.buying != item.id ? "auction-card" : "bid-card";
    }
    return "empty";
  }
  age(age: number) {
    let horsesListView = <ListView>this.horsesListView.nativeElement;
    this.ageFilter = age;
    horsesListView.refresh();
  }
  sex(sex: number) {
    let horsesListView = <ListView>this.horsesListView.nativeElement;
    this.sexFilter = sex;
    horsesListView.refresh();
  }
  getTimeLeft(timeLeft: number) {
    if (timeLeft < 0) {
      return "Expired";
    } else if (timeLeft < 60) {
      return timeLeft + " sec";
    } else if (timeLeft < 3600) {
      return Math.floor(timeLeft/60) + " min";
    } else {
      let hours = Math.floor(timeLeft/3600);
      let mins = Math.floor((timeLeft % 3600)/60);
      return hours + " hr " + mins + " min";
    }
  }
  open(id: number, current: string) {
    this.buying = id;
    let horsesListView = <ListView>this.horsesListView.nativeElement;
    let highBid: number = parseInt(current);
    let oneUp = Math.floor(highBid*1.01);
    this.newBid = this.userService.commaSeparateNumber(oneUp);
    this.error = "High bid: " + this.userService.commaSeparateNumber(highBid);
    horsesListView.refresh();
  }
  cancel() {
    this.buying = -1;
    let horsesListView = <ListView>this.horsesListView.nativeElement;
    horsesListView.refresh();
  }
  bid(id: number, current: string) {
    this.buttonEnabled = false;
    let horsesListView = <ListView>this.horsesListView.nativeElement;
    let highBid: number = parseInt(current);
    if (this.newBid) {
      this.myBidNum = parseInt(this.newBid.replace(/\D/g,''));
    } else {
      this.myBidNum = 0;
    }

    if (this.myBidNum < highBid) {
      this.error = "Must be higher than " + this.userService.commaSeparateNumber(highBid);
      let oneUp = Math.floor(highBid*1.01);
      this.newBid = this.userService.commaSeparateNumber(oneUp);
      this.buttonEnabled = true;
    } else if (this.myBidNum > this.userService.user.coinBalance) {
      this.error = "You do not have enough coins to place this bid.";
      this.buttonEnabled = true;
    } else {
      this.horseService.bid(id, this.myBidNum)
        .subscribe(
          (res) => {
            if (res.status == 0) {
              this.buying = -1;
              this.fetchFromServer();
              this.buttonEnabled = true;
            } else {
              alert(res.message);
              this.buying = -1;
              this.fetchFromServer();
              this.buttonEnabled = true;
            }
        },
          (error) => {}
        );
    }
    horsesListView.refresh();
  }
  goToHorse(id: number) {
    this.router.navigate(["/horse/"+id]);
  }
  fetchFromServer() {
    this.horseService.getAuctionHorses()
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
    if (!this.horseService.auctionHorses) {
      this.fetchFromServer();
    } else {
      this.horses = this.horseService.auctionHorses;
      this.isLoading = false;
    }
  }
}
