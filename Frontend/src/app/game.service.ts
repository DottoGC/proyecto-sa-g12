import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

var juegosip = "http://35.223.103.13:3000";
//var juegosip = "http://localhost:3000";

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
    let url = juegosip + '/simularpartida';
    return this.http.post(url, {});
  }

  newFullSimulation() {
    let objData = {"id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "jugadores": [
                      "PlayerA","PlayerB","PlayerC","PlayerD"
                    ]
    };
    let url = juegosip + '/simular';
    return this.http.post(url, objData);
  }

  newGame() {
    console.log("new game service...");
    let objData = {"id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "jugadores": [
                      "PlayerA","PlayerB","PlayerC","PlayerD"
                    ]
    };
    let url = juegosip + '/generar';
    return this.http.post(url, objData);
  }

  newRun() {
    let url = juegosip + '/tirar';
    return this.http.post(url,{});
  }

}
