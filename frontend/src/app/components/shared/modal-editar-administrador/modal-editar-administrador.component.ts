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
  selector: 'app-modal-editar-administrador',
  templateUrl: './modal-editar-administrador.component.html',
  styleUrls: ['./modal-editar-administrador.component.css']
})
export class ModalEditarAdministradorComponent {
  data: Administrador;
  myForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<ModalEditarAdministradorComponent>, private http: HttpClient, private snackBar: MatSnackBar,@Inject(MAT_DIALOG_DATA) public message:Administrador) {
    this.data = message;
    this.myForm = new FormGroup({
      nombre_administrador: new FormControl(this.data.nombre_administrador, [Validators.required]),
      celular_administrador: new FormControl(this.data.celular_administrador, [Validators.required]),
      estado_administrador: new FormControl(this.data.estado_administrador, [Validators.required]),
      login_administrador: new FormControl(this.data.login_administrador, [Validators.required]),
      pass_administrador: new FormControl(this.data.pass_administrador, [Validators.required])
    });
  }

  editarAdministrador():void{
    if (this.myForm.valid) {
      let formData = this.myForm.value;
      formData['id_administrador'] = this.data.id_administrador;
      const token = localStorage.getItem('token');
      if (token) {
        const headers = new HttpHeaders().set('Authorization', token);
        this.http.put<any>(URL+'api/administrador',formData,{headers})
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
    this.dialogRef.close();
  }

  showAlert(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000, // Duración en milisegundos que se mostrará la alerta (opcional)
    });
  }
}
