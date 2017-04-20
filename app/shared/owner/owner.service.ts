import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { RaceEntry } from "../race/raceEntry";
import { RaceResult } from "../race/raceResult";
import { Horse } from "../horse/horse";
import { Owner } from "./owner";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../config";

@Injectable()
export class OwnerService {
  constructor(private http: Http) {}

  getTopOwners(range: string, type:string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "getOwnerStandings",
      JSON.stringify({
        range: range,
        sort: type
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data.owners;
    })
    .catch(this.handleErrors);
  }

  getOwner(id: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "getOwnerDetails",
      JSON.stringify({
        id: id
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      let ownerDetails = data.ownerDetails;
      let upcomingRaces = [];
      ownerDetails.upcomingRaces.forEach((r) => {
        upcomingRaces.push(new RaceEntry(r.id, r.driverChosen, r.driverConfirmed, r.enteredDate, r.horseID, r.postDrawn, r.purse, r.raceDate, r.raceID, r.description, r.track));
      });

      let pastRaces = [];
      ownerDetails.results.forEach((r) => {
        pastRaces.push(new RaceResult(r.id, r.finishLengths, r.finishPosition, r.finishTime, r.halfLengths, r.halfPosition, r.halfTime, r.horseID, r.horseName, r.post, r.purse, r.quarterLengths, r.quarterPosition, r.quarterTime, r.raceDate, r.raceID, r.description, r.threeQuarterLengths, r.threeQuarterPosition, r.threeQuarterTime, r.track, r.driverName));
      });

      let horseList = [];
      ownerDetails.horses.forEach((h) => {
        horseList.push(new Horse(h.id,h.name,h.dateBorn,h.age,h.sex,h.ownerID,h.ownerName,h.color,h.retired,h.gate,pastRaces,h.stats,upcomingRaces,h.salePrice));
      });

      return (new Owner( ownerDetails.id, ownerDetails.username,ownerDetails.average,ownerDetails.dateJoined,ownerDetails.wins,ownerDetails.places,ownerDetails.shows,ownerDetails.starts,ownerDetails.rank,ownerDetails.rankTotal,horseList,upcomingRaces,pastRaces, ownerDetails.purses))
    })
    .catch(this.handleErrors);
  }

  getConditionString(cond: string){
  	if (!cond) {
  		return null;
  	}
    let c: any = JSON.parse(cond.replace(/([a-z][^:]*)(?=\s*:)/g, '"$1"'));
    var s = "";
    if (c.fm) {
      s += "FM ";
    }
    if (c.nwr) {
  		if (c.nwr == 1) {
  			s += "Maiden";
  		} else {
  			s += "NW "+c.nwr+" Races";
  		}

      if (c.nwm) {
        s += " OR "+c.nwm+"Lifetime";
      }
    } else if (c.nwm) {
      s += "NW "+c.nwm+"Lifetime";
    } else if (c.c) {
  		s += "Claiming " + c.c;
  	}
    return s;
  }

  handleErrors(error: Response) {
    return Observable.throw(error);
  }
}
