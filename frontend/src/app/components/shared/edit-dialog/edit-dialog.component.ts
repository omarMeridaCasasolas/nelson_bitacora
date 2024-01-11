import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef , MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {jwtDecode} from 'jwt-decode';

const URL:string = 'http://localhost:3000/'; 

interface pdoReserva {
  horario_inicio:string,
  horario_final:string,
  time:string,
  tiempo:string,
  dia: string
}

interface bitacora {
  id_bitacora: number,
  id_vehiculo: number,
  id_chofer: number,
  id_usuario: number,
  fecha_bitacora: string,
  hora_inicio: string,
  hora_final: string,
  estado_bitacora: string,
  destino_bitacora: string,
  nro_vale: string,
  kilometraje_inicio: string,
  kilometraje_final: string,
  estado_evaluacion: string,
  motivo_evaluacion: string    
}

interface Usuario {
  id_usuario: string,
  nombre_usuario: string,
  id_unidad: string
}


@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})

export class EditDialogComponent implements OnInit{
  btnTipo:string = 'Actualizar';
  labelTipo: string = 'Actualizar';
  banderaIsDelet:boolean = true;
  data : pdoReserva[] = [
    { horario_inicio: 'opcion1', horario_final: 'Opción 1', time:'10:10:10', tiempo:'10:00:00', dia:'2023-10-10' },
  ];
  opcionSeleccionada: string = 'opcion1';
  
  opcionSeleccionadaCliente: string = 'opcion1';
  opcionSeleccionadaMotivo: string = 'opcion1';
  listaUsuarios: Usuario[] = [];
  myForm: FormGroup;
  durationInSeconds: number = 5;
  datosEdit:bitacora = {id_bitacora:1,id_vehiculo:1,id_usuario:1,id_chofer:1,fecha_bitacora:'',hora_inicio:'',
  hora_final:'',estado_bitacora:'', destino_bitacora:'', nro_vale:'',kilometraje_inicio:'',kilometraje_final:'',estado_evaluacion:'',motivo_evaluacion:''};
  
  isDisabled: boolean = false;
  isDisabledKilometro: boolean = false;
  isAdministrador: boolean = true;
  identificador?: string | null;
  cargo?: string | null;
  estadoReserva: string[]= ['Pendiente','Aceptado','Rechazado'];
  
  constructor(private http: HttpClient, public dialogRef: MatDialogRef<EditDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public message:any,  private snackBar: MatSnackBar){
      this.data = message.horariosDisponibles;
      this.btnTipo = 'Actualizar';
      this.datosEdit = message.dataReserva;
      // console.log(message.dataReserva);
      this.myForm = new FormGroup({
        destino: new FormControl(this.datosEdit.destino_bitacora, [Validators.required]),
        usuario: new FormControl(this.datosEdit.id_usuario, [Validators.required]),
        nroVale: new FormControl({value: this.datosEdit.nro_vale, disabled: this.isDisabled}),
        horario: new FormControl(this.datosEdit.hora_final, [Validators.required]),
        kmInicial: new FormControl({value: this.datosEdit.kilometraje_inicio, disabled: this.isDisabled}),
        kmFinal: new FormControl({value:this.datosEdit.kilometraje_final,disabled: this.isDisabled}),
        fecha: new FormControl(this.data[0].dia),
        horarioInicio: new FormControl(this.data[0].time),
        estado_evaluacion: new FormControl(this.datosEdit.estado_evaluacion),
        motivo_evaluacion: new FormControl(this.datosEdit.motivo_evaluacion),
      });
    }

  ngOnInit(): void {
    // for()
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      this.http.get<Usuario[]>(URL+'api/usuariosDisponibles',{headers})
      .pipe(
        tap(response  => {
          this.listaUsuarios = response;
          this.cargo = this.getUserCargo();
          if(this.cargo == 'usuario'){
            this.identificador = this.getUserID();
            this.isDisabled = true;
            this.isDisabledKilometro = true;
            this.isAdministrador = false;
          }else{
            // console.log(this.cargo);
            if(this.cargo == 'administrador'){
              this.isAdministrador = true;
            }else{
              this.isAdministrador = false;
            }
          }
        }),
        finalize(() => {
          // Realizar acciones finales después de completar la petición
        })
      )
      .subscribe();
    }
  }

  onChangeSlide(event : any){
    let isChecked = event.checked;
    console.log('Slide Toggle Changed: ' + isChecked);
    isChecked ?  this.btnTipo = 'Eliminar': this.btnTipo = 'Actualizar'; 
    isChecked ?  this.labelTipo = 'Eliminar': this.labelTipo = 'Actualizar'; 
    isChecked ?  this.banderaIsDelet = false: this.banderaIsDelet = true; 
  }

  onClickActualizar(){
    if(!this.banderaIsDelet){
      const formData = this.myForm.value;
      const token = localStorage.getItem('token');
      if (token) {
        const headers = new HttpHeaders().set('Authorization', token);
        // this.http.delete(URL+'api/bitacora/'+this.datosEdit.id_bitacora,{headers})
        formData['id_bitacora'] = this.datosEdit.id_bitacora;
        formData['id_vehiculo'] = this.datosEdit.id_vehiculo;
        this.http.post(URL+'api/deleteBitacora',formData,{headers})
        .pipe(
          tap(response  => {
            this.dialogRef.close('exito');
            // this.showAlert(response.toString() == '1' ? 'Exito se ha eliminado la reserva' : response.toString());
          }),
          finalize(() => {
            // Realizar acciones finales después de completar la petición
          })
        )
        .subscribe();
      }
    }else{
        if (this.myForm.valid) {
          const formData = this.myForm.value;
          const token = localStorage.getItem('token');
          if (token) {
            const headers = new HttpHeaders().set('Authorization', token);
            formData['id_vehiculo'] = this.datosEdit.id_vehiculo;
            if(this.cargo == 'administrador'){
              formData['id_administrador'] = this.getUserID();
            }
            this.http.put(URL+'api/bitacora/'+this.datosEdit.id_bitacora,formData,{headers})
            .pipe(
              tap(response  => {
                this.dialogRef.close('exito');
                // this.showAlert(response.toString() == '1' ? 'Exito se ha actualizado la reserva' : response.toString());
              }),
              finalize(() => {
                // Realizar acciones finales después de completar la petición
              })
            )
            .subscribe();
          }
        }
    }
  }

  showAlert(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000, // Duración en milisegundos que se mostrará la alerta (opcional)
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  getUserID(): string | null {
      const decodedToken = this.getDecodedToken();
      return decodedToken ? decodedToken.identificador : null;
  }

  getUserCargo(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.cargo : null;
  }
}
