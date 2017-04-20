import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { RaceEntry } from "../race/raceEntry";
import { RaceResult } from "../race/raceResult";
import { Driver } from "./driver";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../config";

@Injectable()
export class DriverService {
  constructor(private http: Http) {}

  getTopDrivers() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.apiUrl + "getTopDrivers",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data.drivers;
    })
    .catch(this.handleErrors);
  }

  getDrivers() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.apiUrl + "getDrivers",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {

      let drivers = [];
      data.drivers.forEach((r) => {
        drivers.push(new Driver(r.id, r.name, r.age, r.bio, r.image, r.average, r.wins, r.places, r.shows, r.starts, [], []));
      });
      return drivers;
    })
    .catch(this.handleErrors);
  }

  getDriver(id: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "getDriverDetails",
      JSON.stringify({
        id: id
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      let driverDetails = data.driver;
      let upcomingRaces = [];

      // driverDetails.upcomingRaces.forEach((r) => {
      //  upcomingRaces.push(new RaceEntry(r.id, r.driverChosen, r.driverConfirmed, r.enteredDate, r.horseID, r.postDrawn, r.purse, r.raceDate, r.raceID, this.getConditionString(r.restrictions), r.track));
      // });
      //
      let pastRaces = [];
      // driverDetails.results.forEach((r) => {
      //  pastRaces.push(new RaceResult(r.id, r.finishLengths, r.finishPosition, r.finishTime, r.halfLengths, r.halfPosition, r.halfTime, r.horseID, r.horseName, r.post, r.purse, r.quarterLengths, r.quarterPosition, r.quarterTime, r.raceDate, r.raceID, this.getConditionString(r.restrictions), r.threeQuarterLengths, r.threeQuarterPosition, r.threeQuarterTime, r.track));
      // });
      return (new Driver(driverDetails.id, driverDetails.name, driverDetails.age, driverDetails.bio, driverDetails.image, driverDetails.average, driverDetails.wins, driverDetails.places, driverDetails.shows, driverDetails.starts, driverDetails.upcomingRaces, driverDetails.pastRaces))
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
