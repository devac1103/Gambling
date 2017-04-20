import { RaceEntry } from "../race/raceEntry";
import { RaceResult } from "../race/raceResult";
import { Horse } from "../horse/horse";


export class Owner {
  constructor(public id: number,
                public username: string,
                public average: string,
                public dateJoined: string,
                public wins: number,
                public places: number,
                public shows: number,
                public starts: number,
                public rank: number,
                public rankTotal: number,
                public horses: Array<Horse>,
                public upcomingRaces: Array<RaceEntry>,
                public pastRaces: Array<RaceResult>,
                public purses: number)
                {}
}
