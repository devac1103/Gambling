import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Owner } from "../../../shared/owner/owner";
import { RaceEntry } from "../../../shared/race/raceEntry";
import { RaceResult } from "../../../shared/race/raceResult";
import { HorseService, UserService } from "../../../shared/services.module";
import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: "horse",
  templateUrl: "./horse.html",
  styleUrls: ["../profiles-common.css", "./horse-common.css"]
})
export class HorseComponent {
  isLoading = false;
  upcomingOpen = false;
  resultsOpen = false;
  historyOpen = false;
  pedigreeOpen = false;
  private sub: any;
  specs: string;
  horseID: number;
  name: string;
  dateBorn: string;
  age: number;
  sex: number;
  ownerID: number;
  ownerName: string;
  color: string;
  imageColor: string;
  retired: number;
  gate: number;
  starts: number;
  wins: number;
  places: number;
  shows: number;
  average: number;
  upcomingRaces: Array<RaceEntry>;
  pastRaces: Array<RaceResult>;
  history: Array<any> = [];
  stats: string;
  sire: string;
  mare: string;
  ssire: string;
  smare: string;
  msire: string;
  mmare: string;
  sireID: number;
  mareID: number;
  ssireID: number;
  smareID: number;
  msireID: number;
  mmareID: number;
  stakes: boolean;
  purses: string;

  constructor(private horseService: HorseService, private router: Router, private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isLoading = true;
    this.sub = this.route.params.subscribe(params => {
       this.horseID = +params['id'];
       this.horseService.getHorse(this.horseID)
       .subscribe(
         (res) => {
           if (res.name.length) {
             this.name = res.name;
           } else {
             this.name = "Unnamed";
           }
           this.age = res.age;
           this.sex = res.sex;
           this.ownerID = res.ownerID;
           this.ownerName = "owned by " + res.ownerName;
           this.color = res.color;
           this.imageColor = this.color.toLowerCase();

           let gender = "";
           if (this.age < 4) {
             gender = (this.sex == 0) ? "Colt" : "Filly";
           } else {
             gender = (this.sex == 0) ? "Horse" : "Mare";
           }
           this.specs = this.age + " yr old " + this.color + " " + gender;
           this.retired = res.retired;
           this.gate = res.gate;
           this.pastRaces = res.pastRaces;
           this.starts = res.starts;
           this.wins = res.wins;
           this.places = res.places;
           this.shows = res.shows;
           this.average = res.average;
           this.history = res.saleHistory;
           this.upcomingRaces = res.upcomingRaces;
           this.sire = res.firstGen.sireName;
           this.sireID = res.firstGen.sireID;
           this.mare = res.firstGen.mareName;
           this.mareID = res.firstGen.mareID
           this.ssire = res.secondGen[0].sireName;
           this.ssireID = res.secondGen[0].sireID;
           this.smare = res.secondGen[0].mareName;
           this.smareID = res.secondGen[0].mareID;
           this.msire = res.secondGen[1].sireName;
           this.msireID = res.secondGen[1].sireID;
           this.mmare = res.secondGen[1].mareName;
           this.mmareID = res.secondGen[1].mareID;
           this.stakes = res.stakes == 0 ? false : true;
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
  goToOwner(id: number) {
    this.router.navigate(["/owner/"+id]);
  }
}
