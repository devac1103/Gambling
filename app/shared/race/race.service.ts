import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../config";

@Injectable()
export class RaceService {
  constructor(private http: Http) {}

  getUpcoming() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.apiUrl + "getUpcomingRaceCards",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data.raceCards;
    })
    .catch(this.handleErrors);
  }

  getResults() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.apiUrl + "getPastRaceCards",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {

      let races = [];
      data.raceCards.forEach((r) => {
        races.push(r);
      });
      return races;
    })
    .catch(this.handleErrors);
  }
  getRaceCard(id: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "getRaceCardDetails",
      JSON.stringify({
        raceCardID: id
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      let races = [];
      data.races.forEach((r) => {
        races.push(r);
      });
      return races;
    })
    .catch(this.handleErrors);
  }
  claimHorse(raceID: number, horseID: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "claimHorse",
      JSON.stringify({
        raceID: raceID,
        horseID: horseID
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return true;
    })
    .catch(this.handleErrors);
  }
  getProgram(id: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.apiUrl + "getProgram",
      JSON.stringify({
        raceCardID: id
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      if (data.status == 0) {
        let races: any = [];
        data.races.forEach((r) => {
          races.push(r);
        });
        return races;
      } else {
        return false;
      }
    })
    .catch(this.handleErrors);
  }
  handleErrors(error: Response) {
    return Observable.throw(error);
  }
}
