import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ContactsService } from './contacts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'proyecto1';
  displayedColumns: string[] = ['position', 'name', 'casilla', 'puntos'];
  dataSource = ELEMENT_DATA;
  contacts: any[] = [];
  contactName:any ;
  ganador = "";
  turno = 0;
  jugadoractual = "";

  constructor(
    protected contactService: ContactsService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  ngOnInit() {
    //this.lstContacts();
  }

  refresh() {
    console.log("refreshing...");
    this.dataSource = [...this.dataSource];
    this.changeDetectorRefs.detectChanges();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async lstContacts(){
    while (this.ganador == ""){
        await this.sleep(500);
        this.lstContactsAuth();
        console.log(">"+this.ganador);
    }
  }

  lstContactsAuth(){
    this.contactService.getPlayers()
    .subscribe(
      (data) => {
        //console.log(data);
        this.contacts = data['players'];
        ELEMENT_DATA = [];
        for (let i = 0; i < this.contacts.length; i++) {
          //console.log(this.contacts[i].name);
          ELEMENT_DATA.push({
            position: (i + 1),
            name: this.contacts[i].nombre,
            casilla: this.contacts[i].casilla,
            puntos: this.contacts[i].punteo
          });
        }
        this.dataSource = ELEMENT_DATA;
        if (data['ganador'] != ""){
          this.ganador = "El ganador del juego es "+data['ganador']+" con un total de "+data['punteoMaximo']+" puntos!";
        }
        this.turno = data['turno'];
        this.jugadoractual = data['jugadoractual'];
        //console.log(this.dataSource);
        //this.refresh();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  actionNewGame(){
    console.log("New Game...");
  }

  actionNewSim(){
    console.log("Simulation...");
    this.newGameSimulation();
    this.lstContacts();
  }

  newGameSimulation(){
    this.ganador = "";
    this.turno = 0;
    this.contactService.newSimulation()
    .subscribe(
      (data) => {
        console.log("Simulation complete!");
      }
    );
  }

}

export interface ContactElement {
  name: string;
  position: number;
  casilla: number;
  puntos: number;
}

var ELEMENT_DATA: ContactElement[] = [
];
