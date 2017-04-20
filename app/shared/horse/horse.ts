import { RaceEntry } from "../race/raceEntry";

export class Horse {
  genderString: string;

  constructor(public id: number,
                public name: string,
                public dateBorn: string,
                public age: number,
                public sex: number,
                public ownerID: number,
                public ownerName: string,
                public color: string,
                public retired: number,
                public gate: number,
                public pastRaces: Array<Object>,
                public stats: string,
                public upcomingRaces: Array<RaceEntry>,
                public salePrice: number,
                public filter: Object = {},
                public timeLeft: number = null,
                public bidder: string = null,
                public studFee: number = null,
                public stakes: number = null,
                public topSpeed: number = null,
                public gateSpeed: number = null,
                public stamina: number = null,
                public heart: number = null,
                public registered: number = null,
                public breedAvailable: number = null,
                public history: Array<Object> = [],
                public firstGen: Object = {},
                public secondGen: Array<Object> = [],
                public thirdGen: Array<Object> = []) {

                  if (age < 4) {
                    this.genderString = (sex == 0) ? "Colt" : "Filly";
                  } else {
                    this.genderString = (sex == 0) ? "Horse" : "Mare";
                  }
                }
}
