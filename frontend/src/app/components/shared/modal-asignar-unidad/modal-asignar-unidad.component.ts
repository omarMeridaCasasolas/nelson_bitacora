import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, tap } from 'rxjs/operators';

const URL:string = 'http://localhost:3000/'; 

interface Opciones{
  id_unidad: string,
  nombre_unidad: string,
  checked: boolean
}

interface Unidad{
  id_unidad: string
}

interface Administrador{
  id_administrador:string,
  nombre_administrador:string
  celular_administrador:string,
  estado_administrador:boolean,
  login_administrador: string,
  pass_administrador: string
}

interface Data {
  opciones: Opciones[],
  administrador: Administrador  
}

@Component({
  selector: 'app-modal-asignar-unidad',
  templateUrl: './modal-asignar-unidad.component.html',
  styleUrls: ['./modal-asignar-unidad.component.css']
})

export class ModalAsignarUnidadComponent {
  listaIdUnidadesAsignados : number[] = []; 
  checkboxItems:Opciones[]  = [];
  administradorAsignado?: Administrador ;
  constructor(public dialogRef: MatDialogRef<ModalAsignarUnidadComponent>, private http: HttpClient, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public message:Data){
    this.checkboxItems = message.opciones;
    this.administradorAsignado = message.administrador;
    this.unidadesAsignadosAdministrador(message.administrador.id_administrador);
  }

  unidadesAsignadosAdministrador(id:string){
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      this.http.get<Unidad[]>(URL+'api/unidadesAsignadosAdministrador/'+id, {headers})
        .pipe(
        tap(response  => {
            response.forEach(x => {
              for (let i = 0; i < this.checkboxItems.length; i++) {
                if(x.id_unidad == this.checkboxItems[i].id_unidad){
                  this.checkboxItems[i].checked = true;
                  this.listaIdUnidadesAsignados.push(Number.parseInt(x.id_unidad));
                  break;
                }
                
              }
            });
            // this.opcionesUnidad = response;
        }),
        finalize(() => {
            // Realizar acciones finales después de completar la petición
        })
        )
      .subscribe();
    }
  }

  onCheckboxChange(event: any) {
    // console.log(event.source.value);
    if (event.checked) {
      this.listaIdUnidadesAsignados.push(event.source.value);
    } else {
      let index = this.listaIdUnidadesAsignados.findIndex( x=>{
        return x == event.source.value;
      });
      this.listaIdUnidadesAsignados.splice(index, 1);
    }
  }

  asignarUnidad(){
    let data = {listaUnidadesAsignadas: this.listaIdUnidadesAsignados, idAdministrador: this.administradorAsignado?.id_administrador  };
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      this.http.post<any>(URL+'api/asignarUnidadAdministrador',data,{headers})
        .pipe(
          tap(response  => {
            if(response[0].estado == 'Exito'){
              this.showAlert("Se ha registrado la asignacion de vehiculo");
            }else{
              this.showAlert(response[0].estado);
            }
            this.dialogRef.close('exito');
          }),
          finalize(() => {
              // Realizar acciones finales después de completar la petición
          })
        )
      .subscribe();
    }
  }

  showAlert(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 2000, // Duración en milisegundos que se mostrará la alerta (opcional)
    });
  }
}
