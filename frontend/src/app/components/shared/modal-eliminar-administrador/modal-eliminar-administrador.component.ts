import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, tap } from 'rxjs/operators';

const URL:string = 'http://localhost:3000/'; 

interface Administrador{
  id_administrador:string,
  nombre_administrador:string
  celular_administrador:string,
  estado_administrador:boolean,
  login_administrador: string,
  pass_administrador: string
}

@Component({
  selector: 'app-modal-eliminar-administrador',
  templateUrl: './modal-eliminar-administrador.component.html',
  styleUrls: ['./modal-eliminar-administrador.component.css']
})
export class ModalEliminarAdministradorComponent {
  data: Administrador;
  myForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<ModalEliminarAdministradorComponent>, private http: HttpClient, private snackBar: MatSnackBar ,@Inject(MAT_DIALOG_DATA) public message:Administrador){
    this.data = message;
    // console.log(this.data);
    this.myForm = new FormGroup({
      check: new FormControl('', [Validators.required])
    });
  }

  cerrarDialog(): void {
    this.dialogRef.close();
  }

  confirmarEliminacion(): void {
    if (this.myForm.valid) {
      const token = localStorage.getItem('token');
      if (token) {
        const headers = new HttpHeaders().set('Authorization', token);
        this.http.delete<any>(URL+'api/administrador/'+this.data.id_administrador,{headers})
        .pipe(
          tap(response  => {
            this.dialogRef.close();
            if (response.hasOwnProperty('error')) {
              this.showAlert(response.error.toString());
            }
          }),
          finalize(() => {
          })
        )
        .subscribe();
        }
      }
    this.dialogRef.close(true);
  }

  showAlert(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000, // Duración en milisegundos que se mostrará la alerta (opcional)
    });
  }
}
