import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Config } from "../config";

@Injectable()
export class TrackService {

  tracks: Array<any> = null;

  constructor(private http: Http) {}

  getTracks() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.get(
      Config.tracksApiUrl + "getTracks",
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      this.tracks = data.tracks;
      return data.tracks;
    })
    .catch(this.handleErrors);
  }
  getRecords(id: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.tracksApiUrl + "getTrackRecords",
      JSON.stringify({
        id: id
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data.records;
    })
    .catch(this.handleErrors);
  }
  getStakes(trackID: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.tracksApiUrl + "getTrackStakes",
      JSON.stringify({
        id: trackID
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data.stakes;
    })
    .catch(this.handleErrors);
  }
  getStakeRace(id: number) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http.post(
      Config.tracksApiUrl + "getStakeDetails",
      JSON.stringify({
        id: id,
      }),
      { headers: headers }
    )
    .map(response => response.json())
    .map(data => {
      return data;
    })
    .catch(this.handleErrors);
  }
  getTrack(id: number) {
    for (let i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].id == id) {
        return this.tracks[i];
      }
    }
    return false;
  }
  handleErrors(error: Response) {
    return Observable.throw(error);
  }
}
