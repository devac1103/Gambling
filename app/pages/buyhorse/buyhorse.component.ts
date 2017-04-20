import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HorseService, UserService } from "../../shared/services.module";
import { Color } from "color";
import { View } from "ui/core/view";
import * as appSettings from "application-settings";
import { DashboardComponent } from "../../partials/dashboard/dashboard.component";

@Component({
  selector: "buyhorse",
  templateUrl: "pages/buyhorse/buyhorse.html",
  styleUrls: ["pages/buyhorse/buyhorse-common.css", "pages/buyhorse/buyhorse.css"]
})
export class BuyHorseComponent {
  buttonEnabled: boolean;
  sub: any;
  prices: Array<number> = [20000,30000,50000,100000,200000]
  name: string = "";
  genderSelected: number = 0;
  priceNum: number;
  bubble1: string;
  bubble2 = "Pick a name and choose if you want a Colt (Male) or a Filly (Female).";

  @ViewChild(DashboardComponent) dash;
  @ViewChild("bubble") container: ElementRef;

  constructor(private route: ActivatedRoute, private userService: UserService, private horseService: HorseService, private router: Router) {
    this.buttonEnabled = true;
  }

  toggleDisplay() {
    let container = <View>this.container.nativeElement;
    container.animate({
      backgroundColor: new Color("Red"),
      duration: 500
    });
  }

  colt() {
    this.genderSelected = 0;
  }
  filly() {
    this.genderSelected = 1;
  }

  updatePrice() {
    if (this.priceNum+1 < this.prices.length) {
      this.priceNum++;
      appSettings.setNumber("price", this.priceNum);
    }
    this.dash.update();
  }

  submit() {
    this.buttonEnabled = false;
    // remove extra whitespaces
    this.name = this.name.trim();
    while (this.name.indexOf("  ") != -1) {
      this.name = this.name.split("  ").join(" ");
    }
    if (this.userService.user.coinBalance < this.prices[this.priceNum]) {
      this.toggleDisplay();
      this.bubble2 = "You do not have enough coins to make this purchase.";
      this.buttonEnabled = true;
    }
    else if (this.name.length < 3) {
      this.bubble2 = "Horse name must be at least 3 characters.";
      this.toggleDisplay();
      this.buttonEnabled = true;
    } else if (/^[a-zA-Z0-9- ]*$/.test(this.name) == false) {
      this.bubble2 = "Name may not contain special characters.";
      this.toggleDisplay();
      this.buttonEnabled = true;
    } else {
      this.horseService.buyHorse(this.name, this.genderSelected, this.prices[this.priceNum])
      .subscribe(
        (res) => {
          if (res.status == -1) {
            this.toggleDisplay();
            this.bubble2 = res.message;
          } else {
            this.updatePrice();
            this.router.navigate(["/myHorses", 1]);
          }
          this.buttonEnabled = true;
      },
        (error) => {
          // console.log("Error: ", JSON.stringify(error));
          this.buttonEnabled = true;
        }
      );
    }
  }
  ngOnInit() {
    this.dash.update();
    this.priceNum = appSettings.getNumber("price");
    if (!this.priceNum) {
      this.priceNum = 0;
    }
    if (this.userService.user.coinBalance < this.prices[this.priceNum]) {
        this.toggleDisplay();
        this.bubble2 = "You do not have enough coins to make this purchase.";
        this.buttonEnabled = true;
    }
    let price = this.userService.commaSeparateNumber(this.prices[this.priceNum]);
    console.log("Price: ", price);
    this.bubble1 = "Hello again, you can purchase a 2 year old for " + price + " coins.";
  }
}
