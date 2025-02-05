import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute } from '@angular/router';
import { Autor } from '../autor';
import { Router } from '@angular/router';
import { IonAlert, IonButton } from '@ionic/angular/standalone';
import type { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false,
  
})

export class DetallePage implements OnInit {

  id: string = "";
  document: any = {
    id: "",
    data: {} as Autor
  };
  dataAutorEditando: any;
  esNuevo: false;
  modoEdicion = false;
  mostrarGuardar = false;

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) { }
  

  ngOnInit() {

    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
    } else {
      this.id = "";
    }

    const nuevo = this.activatedRoute.snapshot.paramMap.get('nuevo');
    if(nuevo === 'true') {
      this.modoEdicion = false;
      this.mostrarGuardar = true;
      this.document.data = {
        nombreCompleto: '',
        lugarNacimiento: '',
        fechaNacimiento: '',
        fechaDefuncion: '',
        obrasNotables: '',
        imagenURL: ''
      };
      return;
    }

    this.mostrarGuardar = false;
    this.firestoreService.consultarPorId("autores", this.id).subscribe({
      next: (resultado: any) => {
        if (resultado.payload.data()) {
          this.document.id = resultado.payload.id;
          this.document.data = resultado.payload.data();
          this.modoEdicion = true;
        } else {
          this.modoEdicion = false;
          this.mostrarGuardar = true;
          this.document.data = {} as Autor;
        }
      },
      error: (error) => {
        console.error('Error cargando autor:', error);
        this.modoEdicion = false;
      }
    });
  }

  async clicBotonBorrar() {
    try {
      await this.firestoreService.borrar("autores", this.id);
      console.log('Autor eliminado correctamente');
      this.document = {} as Autor;
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al eliminar el autor:', error);
    }
  }

  public alertButtons = [
  {
    text: 'Cancelar',
    role: 'cancel',
    handler: () => {
      console.log('Se canceló la eliminación');
      this.router.navigate(['/home']);
    },
  },
  {
    text: 'Confirmar',
    role: 'confirm',
    handler: () => {
      console.log('Se confirmó la eliminación');
      this.clicBotonBorrar();
    },
  },
];
  
  setResult(event: CustomEvent<OverlayEventDetail>) {
    console.log(`Dismissed with role: ${event.detail.role}`);
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("autores", this.id, this.document.data).then(() => {
      // Limpiar datos de pantalla
      this.document = {} as Autor;
      this.router.navigate(['/home']);
    })
  }

  clicBotonInsertar() {
    const autorNuevo: Autor = { ...this.document.data };
    this.firestoreService.insertar("autores", autorNuevo)
      .then(() => {
        this.document = { id: "", data: {} as Autor };
        this.router.navigate(['/home']);
      })
      .catch(error => console.error('Error:', error));
  }
}