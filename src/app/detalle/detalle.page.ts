import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute } from '@angular/router';
import { Autor } from '../autor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false
})

export class DetallePage implements OnInit {

  id: string = "";
  document: any = {
    id: "",
    data: {} as Autor
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) { }

  ngOnInit() {

    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
    } else {
      this.id = "";
    }

    this.firestoreService.consultarPorId("autores", this.id).subscribe((resultado: any) => {
      if (resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        console.log(this.document.data.nombreCompleto);
      } else {
        this.document.data = {} as Autor;
      }
    }
    )
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("autores", this.id).then(() => {
      // Limpiar datos de pantalla
      this.document = {} as Autor;
      this.router.navigate(['/home']);;
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("autores", this.id, this.document.data).then(() => {
      // Limpiar datos de pantalla
      this.document = {} as Autor;
      this.router.navigate(['/home']);
    })
  }
}