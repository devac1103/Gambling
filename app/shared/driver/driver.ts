import { RaceEntry } from "../race/raceEntry";
import { RaceResult } from "../race/raceResult";

export class Driver {
  constructor(public id: number,
                public name: string,
                public age: number,
                public bio: string,
                public image: string,
                public average: string,
                public wins: number,
                public places: number,
                public shows: number,
                public starts: number,
                public upcomingRaces: Array<RaceEntry>,
                public pastRaces: Array<RaceResult>) {}
}
