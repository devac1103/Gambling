export class RaceEntry {
  constructor(public id: number,
                public driverChosen: number,
                public driverConfirmed: number,
                public enteredDate: string,
                public horseID: number,
                public postDrawn: number,
                public purse: number,
                public raceDate: string,
                public raceID: number,
                public description: string,
                public track: string) {}
}
