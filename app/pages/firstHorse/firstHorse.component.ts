import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { HorseService, UserService } from "../../shared/services.module";
import { Color } from "color";
import { View } from "ui/core/view";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
  selector: "firstHorse",
  templateUrl: "pages/firstHorse/firstHorse.html",
  styleUrls: ["pages/firstHorse/firstHorse-common.css", "pages/firstHorse/firstHorse.css"]
})
export class FirstHorseComponent {
  buttonEnabled: boolean;
  username: string = "";
  name: string = "";
  sub: any;
  step: number = 1;
  genderSelected: number = 0;
  bubble2 = "What would you like to call your stable?";
  bubble3 = "Pick a name and choose if you want a Colt (Male) or a Filly (Female).";

  @ViewChild("bubble") container: ElementRef;

  constructor(private route: ActivatedRoute, private userService: UserService, private horseService: HorseService, private router: RouterExtensions) {
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

  submitStable() {
    this.buttonEnabled = false;
    // remove extra whitespaces
    this.username = this.username.trim();
    while (this.username.indexOf("  ") != -1) {
      this.username = this.username.split("  ").join(" ");
    }

    if (this.username.length < 3) {
      this.bubble2 = "Your stable name must be at least 3 characters.";
      this.toggleDisplay();
      this.buttonEnabled = true;
    } else if (/^[a-zA-Z0-9- ]*$/.test(this.username) == false) {
      this.bubble2 = "Your stable name may not contain special characters.";
      this.toggleDisplay();
      this.buttonEnabled = true;
    } else {
      this.userService.getNewToken(this.username)
      .subscribe(
        (res) => {
            this.step = 2;
            this.buttonEnabled = true;
      },
        (error) => {
          this.toggleDisplay();
          this.bubble2 = "Sorry, that name is already in use.";
          this.buttonEnabled = true;
        }
      );
    }
  }

  submit() {
    this.buttonEnabled = false;
    // remove extra whitespaces
    this.name = this.name.trim();
    while (this.name.indexOf("  ") != -1) {
      this.name = this.name.split("  ").join(" ");
    }

    if (this.name.length < 3) {
      this.bubble3 = "Your horse name must be at least 3 characters.";
      this.toggleDisplay();
      this.buttonEnabled = true;
    } else if (/^[a-zA-Z0-9- ]*$/.test(this.name) == false) {
      this.bubble3 = "Your horse name may not contain special characters.";
      this.toggleDisplay();
      this.buttonEnabled = true;
    } else {
      this.horseService.firstHorse(this.name, this.genderSelected)
      .subscribe(
        (res) => {
            this.router.navigate(["/home"], { clearHistory: true });
            this.buttonEnabled = true;
      },
        (error) => {
          this.bubble3 = "Sorry, another player has chosen that name."
          this.toggleDisplay();
          this.buttonEnabled = true;
        }
      );
    }
  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       if (!isNaN(params['step'])) {
         this.step = +params['step'];
       }
    });
  }
}
