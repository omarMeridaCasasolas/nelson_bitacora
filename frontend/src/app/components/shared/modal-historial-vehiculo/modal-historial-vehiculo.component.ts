import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { finalize, tap } from 'rxjs';

import {jsPDF } from 'jspdf';
// import 'jspdf-autotable';
import autoTable from 'jspdf-autotable'

// declare module 'jspdf' {
//   interface jsPDF {
//     autoTable(options: any): jsPDF;
//   }
// }

const URL:string = 'http://localhost:3000/'; 

interface Bitacora {
  nombre:string,
  nombre_usuario: string,
  destino_bitacora:string,
  fecha_bitacora: string,
  hora_inicio: string,
  hora_final: string,
  kilometraje_inicio: string,
  kilometraje_final: string
}

@Component({
  selector: 'app-modal-historial-vehiculo',
  templateUrl: './modal-historial-vehiculo.component.html',
  styleUrls: ['./modal-historial-vehiculo.component.css']
})
export class ModalHistorialVehiculoComponent implements OnInit {
  displayedColumns: string[] = ['Nombre', 'Usuario', 'Motivo', 'Fecha', 'Hrs. inicio', 'Hrs. final', 'Km. Inicio', 'Km. Final'];
  dataSource = new MatTableDataSource<Bitacora>();
  selectedDateInicio: Date = new Date();
  selectedDateFinal: Date = new Date();
  fechaInicio: string = '';
  fechaFinal: string = '';
  idVehiculo: Number = 0;
  cuerpoTable: Bitacora[] = [];
  constructor(private http: HttpClient, @Inject(MAT_DIALOG_DATA) public message:Number){
    this.idVehiculo = message;
  }
  ngOnInit(): void {
    this.historialVehiculo();
  }

  historialVehiculo(){
    this.fechaInicio = this.selectedDateInicio.getFullYear()+'-'+(this.selectedDateInicio.getMonth()+1).toString().padStart(2, '0')+'-'+this.selectedDateInicio.getDate().toString().padStart(2, '0');
    this.fechaFinal = this.selectedDateFinal.getFullYear()+'-'+(this.selectedDateFinal.getMonth()+1).toString().padStart(2, '0')+'-'+this.selectedDateFinal.getDate().toString().padStart(2, '0');
    // console.log(fechaInicio,fechaFinal);
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', token);
      let data = {fechaInicio:  this.fechaInicio,fechaFinal: this.fechaFinal, idVehiculo: this.idVehiculo};
      this.http.post<Bitacora[]>(URL+'api/historialVehiculo', data, {headers})
      .pipe(
        tap(response  => {
          this.cuerpoTable = response;
          // console.log(response);
          // console.log(ELEMENT_DATA);
          this.dataSource = new MatTableDataSource(response);
        }),
        finalize(() => {
          // Realizar acciones finales después de completar la petición
        })
      )
      .subscribe();
    }
  }

  onDateChanged(event: any) {
    // let fecha = this.selectedDate.getFullYear()+'-'+(this.selectedDate.getMonth()+1).toString().padStart(2, '0')+'-'+this.selectedDate.getDate().toString().padStart(2, '0');
    this.historialVehiculo();
  }

  generarPDF(): void {
    const doc = new jsPDF();
    doc.text('Historico de vehiculo entre la fecha '+this.fechaInicio+ ' a la fecha '+this.fechaFinal, 18, 15);
    autoTable(doc, {
      startY: 25,
      head: [this.displayedColumns],
      body: this.cuerpoTable.map(row => [row.nombre, row.nombre_usuario, row.destino_bitacora, row.fecha_bitacora, row.hora_inicio, row.hora_final, row.kilometraje_inicio, row.kilometraje_final ])
  });

    // Descargar el PDF
    doc.save('tabla.pdf');
  }
}
