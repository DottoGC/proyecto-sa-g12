import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(protected http: HttpClient) {
  }

  getAuth_oAuth2() {
    let objAuth = {'grant_type': 'client_credentials',
                   'client_id': 'micro-juegos',
                   'client_secret': 'secret-juegos-micro'};
    let newContactstr = 'https://ip/getToken';
    return this.http.post(newContactstr, objAuth);
  }

  getPlayers() {
    let url = 'http://localhost:9000/getInfo';
    console.log("Pidiendo resultados:"+url);
    return this.http.post(url, {});
  }

  newSimulation() {
    let url = 'http://localhost:9000/simulate';
    //Enviar arreglo de jugadores
    return this.http.post(url, {});
  }

  newFullSimulation() {
    let url = 'http://localhost:9000/fullsimulate';
    //Enviar arreglo de jugadores
    return this.http.post(url, {});
  }

  newGame() {
    let url = 'http://localhost:9000/generate';
    //Enviar arreglo de jugadores
    return this.http.post(url, {});
  }

  newRun() {
    let url = 'http://localhost:9000/tirar';
    //Enviar arreglo de jugadores
    return this.http.post(url, {});
  }

}
