import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, tap } from 'rxjs/operators';

const URL:string = 'http://localhost:3000/'; 

@Component({
  selector: 'app-modal-agregar-administrador',
  templateUrl: './modal-agregar-administrador.component.html',
  styleUrls: ['./modal-agregar-administrador.component.css']
})

export class ModalAgregarAdministradorComponent {
  myForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<ModalAgregarAdministradorComponent>, private http: HttpClient, private snackBar: MatSnackBar) {
    this.myForm = new FormGroup({
      nombre_administrador: new FormControl('', [Validators.required]),
      celular_administrador: new FormControl('', [Validators.required]),
      estado_administrador: new FormControl('', [Validators.required]),
      login_administrador: new FormControl('', [Validators.required]),
      pass_administrador: new FormControl('', [Validators.required])
    });
  }

  agregarAdministrador(){
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      const token = localStorage.getItem('token');
      if (token) {
        const headers = new HttpHeaders().set('Authorization', token);
        this.http.post<any>(URL+'api/administrador',formData, {headers})
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
  }

  showAlert(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000, // Duración en milisegundos que se mostrará la alerta (opcional)
    });
  }
}
