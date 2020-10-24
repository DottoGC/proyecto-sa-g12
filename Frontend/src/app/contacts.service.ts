import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(protected http: HttpClient) { }

  getAuth_oAuth2() {
    let objAuth = {'grant_type': 'client_credentials',
                   'client_id': 'sa',
                   'client_secret': 'fb5089840031449f1a4bf2c91c2bd2261d5b2f122bd8754ffe23be17b107b8eb103b441de3771745'};
    let newContactstr = 'https://api.softwareavanzado.world/index.php?option=token&api=oauth2';
    return this.http.post(newContactstr, objAuth);
  }

  getContacts(access_token) {
    let callheaders: HttpHeaders = new HttpHeaders();
    console.log(access_token);
    callheaders = callheaders.append('Authorization', 'Bearer ' + access_token);
    let options = {headers:callheaders};
    let url = 'https://api.softwareavanzado.world/index.php?webserviceClient=administrator&webserviceVersion=1.0.0&option=contact&api=hal&filter[search]=200915168';
    return this.http.get(url, options);
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

  newContact(contactName, access_token){
    let callheaders: HttpHeaders = new HttpHeaders();
    console.log(access_token);
    callheaders = callheaders.append('Authorization', 'Bearer ' + access_token);

    let httpParams = new HttpParams()
    .append("name", contactName);

    let options = {headers:callheaders};

    var newContactstr = 'https://api.softwareavanzado.world/index.php?webserviceClient=administrator&webserviceVersion=1.0.0&option=contact&api=hal'
    console.log(newContactstr);
    return this.http.post(newContactstr,httpParams, options);
  }

}
