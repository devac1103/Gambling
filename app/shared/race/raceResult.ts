export class RaceResult {
  earned: number;
  constructor(public id: number,
                public finishLengths: number,
                public finishPosition: number,
                public finishTime: string,
                public halfLengths: number,
                public halfPosition: number,
                public halfTime: string,
                public horseID: number,
                public horseName: string,
                public post: number,
                public purse: number,
                public quarterLengths: number,
                public quarterPosition: number,
                public quarterTime: string,
                public raceDate: string,
                public raceID: number,
                public description: string,
                public threeQuarterLengths: number,
                public threeQuarterPosition: number,
                public threeQuarterTime: string,
                public track: string,
                public driverName: string) {
    let multiplier:number = 0;

    if (finishPosition == 1){
      multiplier = 0.5;
    } else if (finishPosition == 2) {
      multiplier = 0.25;
    } else if (finishPosition == 3) {
      multiplier = 0.12;
    } else if (finishPosition == 4) {
      multiplier = 0.08;
    } else if (finishPosition == 5) {
      multiplier = 0.05;
    }
    this.earned = purse * multiplier;
  }
}
