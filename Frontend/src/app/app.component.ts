import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'proyecto1';
  displayedColumns: string[] = ['position', 'name', 'casilla', 'puntos'];
  dataSource = ELEMENT_DATA;
  jugadores: any[] = [];
  nombreJugador:any ;
  ganador = "";
  turno = 0;
  jugadoractual = "";

  constructor(
    protected gameService: GameService,
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

  async lstGameInfo(){
    while (this.ganador == ""){
        await this.sleep(500);
        this.lstGameInfoNow();
        console.log(">"+this.ganador);
    }
  }

  lstnewGameInfo(){
      this.lstGameInfoNow();
  }

  lstGameInfoNow(){
    this.gameService.getPlayers()
    .subscribe(
      (data) => {
        //console.log(data);
        this.jugadores = data['players'];
        ELEMENT_DATA = [];
        for (let i = 0; i < this.jugadores.length; i++) {
          ELEMENT_DATA.push({
            position: (i + 1),
            name: this.jugadores[i].nombre,
            casilla: this.jugadores[i].casilla,
            puntos: this.jugadores[i].punteo
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

  async actionNewGame(){
    console.log("New Game...");
    this.newGameStart();
    await this.sleep(500);
    this.lstnewGameInfo();
  }

  async actionNewSim(){
    console.log("Simulation...");
    this.newGameSimulation();
    await this.sleep(500);
    this.lstGameInfo();
  }

  async actionNewFullSim(){
    console.log("Full Simulation...");
    this.newGameFullSimulation();
    await this.sleep(500);
    this.lstGameInfo();
  }

  actionPlay(){
    console.log("Nuevo Tiro...");
    this.newPlayerRun();
    this.lstnewGameInfo();
  }

  newGameSimulation(){
    this.ganador = "";
    this.gameService.newSimulation()
    .subscribe(
      (data) => {
        console.log("Simulation complete!");
      }
    );
  }

  newGameFullSimulation(){
    this.ganador = "";
    this.turno = 0;
    this.gameService.newFullSimulation()
    .subscribe(
      (data) => {
        console.log("Full Simulation complete!");
      }
    );
  }

  newGameStart(){
    this.ganador = "";
    this.turno = 0;
    this.gameService.newGame()
    .subscribe(
      (data) => {
        console.log("New Game started!");
      }
    );
  }

  newPlayerRun(){
    this.gameService.newRun()
    .subscribe(
      (data) => {
        console.log("Tiro realizado!");
      }
    );
  }
}

export interface PlayerElement {
  name: string;
  position: number;
  casilla: number;
  puntos: number;
}

var ELEMENT_DATA: PlayerElement[] = [
];
