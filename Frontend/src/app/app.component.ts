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

  constructor(
    protected contactService: ContactsService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.lstContactsAuth();
  }

  refresh() {
    console.log("refreshing...");
    this.dataSource = [...this.dataSource];
    this.changeDetectorRefs.detectChanges();
  }

  lstContacts(){
    console.log("geting auth...");
    this.contactService.getAuth_oAuth2()
    .subscribe(
      data => {// Success
        console.log("response to auth:");
        console.log(data);
        this.lstContactsAuth();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  lstContactsAuth(){
    this.contactService.getPlayers()
    .subscribe(
      (data) => {
        console.log(data);
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
        console.log(this.dataSource);
        this.refresh();
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
