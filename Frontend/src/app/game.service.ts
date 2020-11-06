import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

var juegosip = "http://35.223.103.13:3000";
//var juegosipLocal = "http://localhost:9000/";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(protected http: HttpClient) {
  }

  getPlayers() {
    let url = juegosip + '/getInfo';
    console.log("Pidiendo resultados:"+url);
    return this.http.post(url, {});
  }

  newSimulation() {
    let url = juegosip + '/simulate';
    return this.http.post(url, {});
  }

  newFullSimulation() {
    let url = juegosip + '/fullsimulate';
    return this.http.post(url, {});
  }

  newGame() {
    console.log("new game service...");
    let url = juegosip + '/generate';
    return this.http.post(url,{},{});
  }

  newRun() {
    let url = juegosip + '/tirar';
    return this.http.post(url,{},{});
  }

}
