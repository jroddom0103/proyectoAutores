import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Autor } from '../autor';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage {

  constructor(private firestoreService: FirestoreService, private router: Router) {
    // Crear un autor vacío
    this.autorEditando = {} as Autor;
    this.obtenerListaAutores();
  }

  autorEditando: Autor;

  arrayColeccionAutores: any = [{
    id: "",
    data: {} as Autor
  }];

  idAutorSelec: string;

  selecAutor(autorSelec) {
    console.log("Autor seleccionado: ");
    console.log(autorSelec);
    this.idAutorSelec = autorSelec.id;
    this.autorEditando.nombreCompleto = autorSelec.data.nombreCompleto;
    this.autorEditando.lugarNacimiento = autorSelec.data.lugarNacimiento;
    this.autorEditando.obrasNotables = autorSelec.data.obrasNotables;

    this.router.navigate(['/detalle', this.idAutorSelec]);;

  }

  clicBotonInsertar() {
    this.router.navigate(['/detalle','nuevo']);
  }

  obtenerListaAutores() {
    this.firestoreService.consultar("autores").subscribe((resultadoConsultaAutores) => {
      this.arrayColeccionAutores = [];
      resultadoConsultaAutores.forEach((datosAutor: any) => {
        this.arrayColeccionAutores.push({
          id: datosAutor.payload.doc.id,
          data: datosAutor.payload.doc.data()
        });
      })
    });
  }

}