import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ModalAgregarAdministradorComponent } from '../shared/modal-agregar-administrador/modal-agregar-administrador.component';
import { jwtDecode } from 'jwt-decode';
import { finalize, tap } from 'rxjs/operators';
import { ModalEliminarAdministradorComponent } from '../shared/modal-eliminar-administrador/modal-eliminar-administrador.component';
import { ModalEditarAdministradorComponent } from '../shared/modal-editar-administrador/modal-editar-administrador.component';
import { ModalAsignarUnidadComponent } from '../shared/modal-asignar-unidad/modal-asignar-unidad.component';

const URL:string = 'http://localhost:3000/'; 

interface Administrador{
  id_administrador:string,
  nombre_administrador:string
  celular_administrador:string,
  estado_administrador:boolean,
  login_administrador: string,
  pass_administrador: string
}

interface Unidad{
  id_unidad:Number,
  nombre_unidad:string,
  checked: boolean
}

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit{
  opcionesUnidad: Unidad[] = [];
  displayedColumns: string[] = ['Nombre','Celular', 'Login', 'Estado', 'Acciones'];
  dataSource = new MatTableDataSource<Administrador>();
  cargo?: string | null;
  constructor(private http: HttpClient, public dialog: MatDialog, private socket: Socket, private router: Router, private snackBar: MatSnackBar){}
  
  ngOnInit(): void {
    this.cargo = this.getUserCargo();
    this.solicitarAdministradores();
    this.getListaUnidadesDisponibles();
    
    this.socket.on('agregarAdministrador', (data: Administrador) => {
      this.dataSource.data.push(data); 
      this.dataSource.data = [...this.dataSource.data];
      this.showAlert('Se ha agregado un nuevo administrador '+data.nombre_administrador);
    });

    this.socket.on('eliminarAdministardor', (data: any) => {
      let index = this.dataSource.data.findIndex( x=>{
        return x.id_administrador == data;
      });
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data];
      this.showAlert('Se ha elimnado un registro de administrador');
    });

    this.socket.on('editarAdministrador', (data: Administrador) => {
      let index = this.dataSource.data.findIndex( x=>{
        return x.id_administrador == data.id_administrador;
      });
      this.dataSource.data.splice(index, 1);
      this.dataSource.data.push(data); 
      this.dataSource.data = [...this.dataSource.data];
      this.showAlert('Se ha actualizado los registros de administracion '+data.nombre_administrador);
    });
  }

  editarAdministrador(element: Administrador){
    const dialogRef = this.dialog.open(ModalEditarAdministradorComponent, {
      width: '450px',
      data:  element 
    });
  }

  eliminarAdministrador(element: Administrador){
    const dialogRef = this.dialog.open(ModalEliminarAdministradorComponent, {
      width: '450px',
      data:  element 
    });
  }

  solicitarAdministradores(){
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      this.http.get<Administrador[]>(URL+'api/administrador', {headers})
      .pipe(
        tap(response  => {
          this.dataSource = new MatTableDataSource(response);
        }),
        finalize(() => {
          // Realizar acciones finales después de completar la petición
        })
      )
      .subscribe();
      }
  }


  getListaUnidadesDisponibles():void{
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      this.http.get<Unidad[]>(URL+'api/unidadDisponibles',{ headers })
        .pipe(
        tap(response  => {
          this.opcionesUnidad = response;
        }),
        finalize(() => {
            // Realizar acciones finales después de completar la petición
        })
        )
      .subscribe();
    }
  }

  asignarUnidad(element: Unidad){
    this.opcionesUnidad.forEach(x => {
      x.checked = false;
    });
    const dialogRef = this.dialog.open(ModalAsignarUnidadComponent, {
      width: '450px',
      data:  {opciones: this.opcionesUnidad, administrador: element} 
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('Diálogo cerrado con resultado:', result);
    });
  }

  abrirDialog() {
    const dialogRef = this.dialog.open(ModalAgregarAdministradorComponent, {
      width: '450px',
      data: { /* Puedes pasar datos al diálogo si es necesario */ }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('Diálogo cerrado con resultado:', result);
    });
  }

  showAlert(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000, // Duración en milisegundos que se mostrará la alerta (opcional)
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  getUserCargo(): string | null {
    const decodedToken = this.getDecodedToken();
    // console.log(decodedToken);
    return decodedToken ? decodedToken.cargo : null;
  }
}
