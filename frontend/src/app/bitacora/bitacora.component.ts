import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, finalize} from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from "../components/shared/confirm-dialog/confirm-dialog.component";
import { EditDialogComponent } from "../components/shared/edit-dialog/edit-dialog.component";
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { Socket } from "ngx-socket-io";
import { MatSnackBar } from "@angular/material/snack-bar";


const URL:string = 'http://localhost:3000/'; 

interface respuesta{
    estado: string
}

interface cabezera {
    hora: string,
    dia: string
}

interface Vehiculo {
    id_vehiculo: string,
    nombre: string
}

interface Chofer{
    id_chofer: string ,
    nombre_chofer: string
}

interface Unidad{
    id_unidad: string ,
    nombre_unidad: string
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

interface ApiResponse {
    lunes: bitacora[];
    martes: bitacora[];
    miercoles: bitacora[];
    jueves: bitacora[];
    viernes: bitacora[];
    sabado: bitacora[];
    domingo: bitacora[];
}

@Component ({
    selector:'app-bitacora',
    templateUrl: './bitacora.component.html',
    styleUrls: ['./bitacora.component.css']
})

export class BitacoraComponent implements OnInit {
    cabezeraTable : cabezera[] = [{hora:'hora',dia:''}];
    cuerpoTable : any = [];
    listaHorarios: any [] = [];
    listaReserva: ApiResponse = {lunes:[], martes:[],miercoles:[],jueves:[],viernes:[],sabado:[],domingo:[]};
    horariosDisponibles:any = []; 

    // picker:string = '';
    selectedDate: Date = new Date();

    opcionesVehiculo: Vehiculo[] = [];
    opcionesChofer: Chofer[] = [];
    opcionesUnidad: Unidad[] = [];
    selectedDefault:string = '';
    selectedVehiculo:string = '';

    nombreUsuario: string = 'usuario';
    idUsuario?: string | null;

    chofer:boolean = false;

    cargo?: string | null;
    unidad?: string | null;
    codigoID?: string | null;
    banderaModalAbierto: boolean = false;

    unidadVisible?: string | null;

    fechaActual: string = '';

    constructor(private http: HttpClient, private dialog: MatDialog,  private socket: Socket, private router: Router, private snackBar: MatSnackBar) { }
       
    ngOnInit(): void {
        this.cargo = this.getUserCargo();
        this.unidad = this.getUserUnidad();
        this.idUsuario = this.getUserID();
        this.codigoID = this.getUserID();;
        this.listaUnidadesDisponibles();
        // this.solicitarReservas();

        this.socket.on('agregarReserva', (data: any) => {
            // console.log(data,this.selectedDate);
            console.log(data.fecha);

            let auxReserva = new Date(data.fecha+'T00:00:00');
            // auxReserva.setHours(0, 0, 0, 0);
            let timeReserva = auxReserva.getTime();

            let auxReservaInicio = new Date(this.selectedDate);
            auxReservaInicio.setHours(0, 0, 0, 0);
            let timeInicio = auxReservaInicio.getTime();

            let auxReservaFinal = new Date(this.selectedDate);
            auxReservaFinal.setDate(auxReservaFinal.getDate() + 7);
            auxReservaFinal.setHours(0, 0, 0, 0);
            let timeFinal = auxReservaFinal.getTime();
            console.log(auxReservaInicio,auxReserva,auxReservaFinal);
            if(data.id_vehiculo == this.selectedVehiculo && (auxReserva >= auxReservaInicio && auxReserva <= auxReservaFinal)){
                this.solicitarReservas();
                this.showAlert("Se ha registrado una nueva reserva");
            }
            console.log(this.fechaActual,data.fecha);
            if(this.fechaActual == data.fecha){
                this.dialog.closeAll();
            }
        });
      
        this.socket.on('eliminarReserva', (data: any) => {
            console.log(data);
            // let auxReserva = new Date(data.fecha);
            let auxReserva = new Date(data.fecha+'T00:00:00');
            auxReserva.setHours(0, 0, 0, 0);
            let timeReserva = auxReserva.getTime();

            let auxReservaInicio = new Date(this.selectedDate);
            auxReservaInicio.setHours(0, 0, 0, 0);
            let timeInicio = auxReservaInicio.getTime();

            let auxReservaFinal = new Date(this.selectedDate);
            auxReservaFinal.setDate(auxReservaFinal.getDate() + 7);
            auxReservaFinal.setHours(0, 0, 0, 0);
            let timeFinal = auxReservaFinal.getTime();
            // if(data.id_vehiculo == this.selectedVehiculo && (timeReserva >= timeInicio && timeReserva <= timeFinal)){
            if(data.id_vehiculo == this.selectedVehiculo && (auxReserva >= auxReservaInicio && auxReserva <= auxReservaFinal)){
                this.solicitarReservas();
                this.showAlert("Se ha eliminado una reserva");
            }
            console.log(this.fechaActual,data.fecha);
            if(this.fechaActual == data.fecha && this.banderaModalAbierto){
                this.dialog.closeAll();
            }
        });
    
        this.socket.on('editarReserva', (data: any) => {
            console.log(data);
            // let auxReserva = new Date(data.fecha);
            let auxReserva = new Date(data.fecha+'T00:00:00');
            auxReserva.setHours(0, 0, 0, 0);
            let timeReserva = auxReserva.getTime();

            let auxReservaInicio = new Date(this.selectedDate);
            auxReservaInicio.setHours(0, 0, 0, 0);
            let timeInicio = auxReservaInicio.getTime();

            let auxReservaFinal = new Date(this.selectedDate);
            auxReservaFinal.setDate(auxReservaFinal.getDate() + 7);
            auxReservaFinal.setHours(0, 0, 0, 0);
            let timeFinal = auxReservaFinal.getTime();
            // if(data.id_vehiculo == this.selectedVehiculo && (timeReserva >= timeInicio && timeReserva <= timeFinal)){
            if(data.id_vehiculo == this.selectedVehiculo && (auxReserva >= auxReservaInicio && auxReserva <= auxReservaFinal)){
                this.solicitarReservas();
                this.showAlert("Se ha editado una reserva");
            }
            if(this.fechaActual == data.fecha){
                this.dialog.closeAll();
            }
        });
    }

    onDateChanged(event: any) {
        let fecha = this.selectedDate.getFullYear()+'-'+(this.selectedDate.getMonth()+1).toString().padStart(2, '0')+'-'+this.selectedDate.getDate().toString().padStart(2, '0');
        this.solicitarReservas();
    }

    onUnidadChanged(event: any) {
        this.selectedVehiculo = '';
        this.vehiculosDisponiblesUnidad(event.value);
    }

    listaUnidadesDisponibles(){
        const token = localStorage.getItem('token');
        if(token){
            const headers = new HttpHeaders().set('Authorization', token);
            this.http.get<Unidad[]>(URL+'api/unidadDisponibles',{headers})
                .pipe(
                tap(response  => {
                    this.opcionesUnidad = response;
                    if(this.unidad != '0' || this.cargo == 'administrador'){
                        this.unidadVisible = 'block';
                    }else{
                        // this.listaChoferesDisponibles();
                        this.listaVehiculosDisponiblesChofer();
                        this.unidadVisible = 'none';
                    }
                }),
                finalize(() => {
                    // Realizar acciones finales después de completar la petición
                })
                )
            .subscribe();
        }
    }

    listaChoferesDisponibles(){
        const token = localStorage.getItem('token');
        if(token){
            const headers = new HttpHeaders().set('Authorization', token);
            this.http.get<Chofer[]>(URL+'api/choferDisponibles',{headers})
                .pipe(
                tap(response  => {
                    // console.log(response);
                    // this.opcionesVehiculo = response;
                    // let ultimo = response[response.length -1];
                    // this.selectedDefault = ultimo.id_chofer;
                    this.solicitarReservas();
                }),
                finalize(() => {
                    // Realizar acciones finales después de completar la petición
                })
                )
            .subscribe();
        }
    }

    listaVehiculosDisponiblesChofer(){
        const token = localStorage.getItem('token');
        if(token){
            const headers = new HttpHeaders().set('Authorization', token);
            this.http.get<Vehiculo[]>(URL+'api/vehiculosDisponiblesPorChofer/'+this.idUsuario,{headers})
                .pipe(
                tap(response  => {
                    this.opcionesVehiculo = response;
                }),
                finalize(() => {
                    // Realizar acciones finales después de completar la petición
                })
                )
            .subscribe();
        }
    }

    vehiculosDisponiblesUnidad(id: any){
        const token = localStorage.getItem('token');
        if(token){
            const headers = new HttpHeaders().set('Authorization', token);
            this.http.get<Vehiculo[]>(URL+'api/vehiculosDisponiblesUnidad/'+id,{headers})
                .pipe(
                tap(response  => {
                    response.unshift({id_vehiculo:'',nombre:'Selecione un vehiculo'});
                    this.opcionesVehiculo = response;
                }),
                finalize(() => {
                    // Realizar acciones finales después de completar la petición
                })
                )
            .subscribe();
        }
    }

    getMatchedFormat(header: string): boolean {
        const regex = /^\d{2}:\d{2}:\d{2}$/;
        return regex.test(header);
    }

    obtenerFilaColumna(fila: number, columna: number) {
        let time:string = this.cuerpoTable[fila].hora;
        let datos = this.cabezeraTable[columna];
        this.fechaActual = datos['dia'];
        console.log(datos['dia']);

        this.horariosDisponibles = [];
        let horaInicio = convertirCadenaTiempoAFecha(time);
        let bandera = true;
        let i = 0;
        let fechaAux = new Date(datos['dia']+'T00:00:00');
        fechaAux.setHours(0);
        fechaAux.setMinutes(0);
        let diaSemana:String =  datos.hora;
        switch (diaSemana) {
            case 'lunes':
                while(bandera && i < 120){
                    let horario = this.listaReserva.lunes.find(element => {
                        return element.hora_inicio == horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0');
                    });
                    if(horario === undefined){
                        let objeto = {
                            horario_inicio:horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0'),
                            horario_final:'',
                            time,
                            tiempo:'',
                            dia: datos.dia
                        };
                        fechaAux.setMinutes(fechaAux.getMinutes() + 15);
                        objeto.tiempo = fechaAux.getHours()+' hrs. '+fechaAux.getMinutes()+' min.'; 
                        horaInicio.setMinutes(horaInicio.getMinutes() + 14);
                        objeto.horario_final = horaInicio.getHours()+':'+horaInicio.getMinutes()+':59';
                        this.horariosDisponibles.push(objeto);
                        horaInicio.setMinutes(horaInicio.getMinutes() + 1);
                    }else{
                        bandera = false;
                    }
                    i++;
                }
                break;
            case 'martes':
                // console.log(this.listaReserva.martes);
                while(bandera && i < 120){
                    let horario = this.listaReserva.martes.find(element => {
                        return element.hora_inicio == horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0');
                    });
                    if(horario === undefined){
                        let objeto = {
                            horario_inicio:horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0'),
                            horario_final:'',
                            time,
                            tiempo:'',
                            dia: datos.dia
                        };
                        fechaAux.setMinutes(fechaAux.getMinutes() + 15);
                        objeto.tiempo = fechaAux.getHours()+' hrs. '+fechaAux.getMinutes()+' min.'; 
                        horaInicio.setMinutes(horaInicio.getMinutes() + 14);
                        objeto.horario_final = horaInicio.getHours()+':'+horaInicio.getMinutes()+':59';
                        this.horariosDisponibles.push(objeto);
                        horaInicio.setMinutes(horaInicio.getMinutes() + 1);
                    }else{
                        bandera = false;
                    }
                    i++;
                }
                break;
            case 'miercoles':
                while(bandera && i < 120){
                    let horario = this.listaReserva.miercoles.find(element => {
                        return element.hora_inicio == horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0');
                    });
                    if(horario === undefined){
                        let objeto = {
                            horario_inicio:horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0'),
                            horario_final:'',
                            time,
                            tiempo:'',
                            dia: datos.dia
                        };
                        fechaAux.setMinutes(fechaAux.getMinutes() + 15);
                        objeto.tiempo = fechaAux.getHours()+' hrs. '+fechaAux.getMinutes()+' min.'; 
                        horaInicio.setMinutes(horaInicio.getMinutes() + 14);
                        objeto.horario_final = horaInicio.getHours()+':'+horaInicio.getMinutes()+':59';
                        this.horariosDisponibles.push(objeto);
                        horaInicio.setMinutes(horaInicio.getMinutes() + 1);
                    }else{
                        bandera = false;
                    }
                    i++;
                }
                break;
            case 'jueves':
                while(bandera && i < 120){
                    let horario = this.listaReserva.jueves.find(element => {
                        return element.hora_inicio == horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0');
                    });
                    if(horario === undefined){
                        let objeto = {
                            horario_inicio:horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0'),
                            horario_final:'',
                            time,
                            tiempo:'',
                            dia: datos.dia
                        };
                        fechaAux.setMinutes(fechaAux.getMinutes() + 15);
                        objeto.tiempo = fechaAux.getHours()+' hrs. '+fechaAux.getMinutes()+' min.'; 
                        horaInicio.setMinutes(horaInicio.getMinutes() + 14);
                        objeto.horario_final = horaInicio.getHours()+':'+horaInicio.getMinutes()+':59';
                        this.horariosDisponibles.push(objeto);
                        horaInicio.setMinutes(horaInicio.getMinutes() + 1);
                    }else{
                        bandera = false;
                    }
                    i++;
                }
                break;
            case 'viernes':
                while(bandera && i < 120){
                    let horario = this.listaReserva.viernes.find(element => {
                        return element.hora_inicio == horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0');
                    });
                    if(horario === undefined){
                        let objeto = {
                            horario_inicio:horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0'),
                            horario_final:'',
                            time,
                            tiempo:'',
                            dia: datos.dia
                        };
                        fechaAux.setMinutes(fechaAux.getMinutes() + 15);
                        objeto.tiempo = fechaAux.getHours()+' hrs. '+fechaAux.getMinutes()+' min.'; 
                        horaInicio.setMinutes(horaInicio.getMinutes() + 14);
                        objeto.horario_final = horaInicio.getHours()+':'+horaInicio.getMinutes()+':59';
                        this.horariosDisponibles.push(objeto);
                        horaInicio.setMinutes(horaInicio.getMinutes() + 1);
                    }else{
                        bandera = false;
                    }
                    i++;
                }
                break;
            case 'sabado':
                while(bandera && i < 120){
                    let horario = this.listaReserva.sabado.find(element => {
                        return element.hora_inicio == horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0');
                    });
                    if(horario === undefined){
                        let objeto = {
                            horario_inicio:horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0'),
                            horario_final:'',
                            time,
                            tiempo:'',
                            dia: datos.dia
                        };
                        fechaAux.setMinutes(fechaAux.getMinutes() + 15);
                        objeto.tiempo = fechaAux.getHours()+' hrs. '+fechaAux.getMinutes()+' min.'; 
                        horaInicio.setMinutes(horaInicio.getMinutes() + 14);
                        objeto.horario_final = horaInicio.getHours()+':'+horaInicio.getMinutes()+':59';
                        this.horariosDisponibles.push(objeto);
                        horaInicio.setMinutes(horaInicio.getMinutes() + 1);
                    }else{
                        bandera = false;
                    }
                    i++;
                }
                break;                
            default:
                while(bandera && i < 120){
                    let horario = this.listaReserva.domingo.find(element => {
                        return element.hora_inicio == horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0');
                    });
                    if(horario === undefined){
                        let objeto = {
                            horario_inicio:horaInicio.getHours().toString().padStart(2, '0')+':'+horaInicio.getMinutes().toString().padStart(2, '0')+':'+horaInicio.getSeconds().toString().padStart(2, '0'),
                            horario_final:'',
                            time,
                            tiempo:'',
                            dia: datos.dia
                        };
                        fechaAux.setMinutes(fechaAux.getMinutes() + 15);
                        objeto.tiempo = fechaAux.getHours()+' hrs. '+fechaAux.getMinutes()+' min.'; 
                        horaInicio.setMinutes(horaInicio.getMinutes() + 14);
                        objeto.horario_final = horaInicio.getHours()+':'+horaInicio.getMinutes()+':59';
                        this.horariosDisponibles.push(objeto);
                        horaInicio.setMinutes(horaInicio.getMinutes() + 1);
                    }else{
                        bandera = false;
                    }
                    i++;
                }
                break;
        }
        // console.log();
        this.openDialog();
    }

    openDialog():void {
        // console.log(this.horariosDisponibles);
        this.banderaModalAbierto = true;
        const dialogRef = this.dialog.open(ConfirmDialogComponent,{
            width:'450px',
            data: { horariosDisponibles: this.horariosDisponibles , idVehiculo: this.selectedVehiculo}
        });
        // console.log(this.banderaModalAbierto);

        dialogRef.afterClosed().subscribe(res => {
            this.banderaModalAbierto = false;
            // console.log(res);
            // console.log(this.banderaModalAbierto);
        });
    }

    openEditDialog(dataEdit:bitacora){
        if(this.cargo == 'chofer' || this.cargo == 'administrador'){
            const dialogEditRef = this.dialog.open(EditDialogComponent,{
                width:'500px',
                // message: this.horariosDisponibles,
                data: {horariosDisponibles :this.horariosDisponibles , dataReserva:dataEdit}
                // reserva: 
            });
            dialogEditRef.afterClosed().subscribe(res => {
                this.banderaModalAbierto = false;
                // console.log(res);
                // console.log(this.banderaModalAbierto);
            });
        }else{
            if(this.codigoID == dataEdit.id_usuario.toString()){
                const dialogEditRef = this.dialog.open(EditDialogComponent,{
                    width:'500px',
                    // message: this.horariosDisponibles,
                    data: {horariosDisponibles :this.horariosDisponibles , dataReserva:dataEdit}
                    // reserva: 
                }); 
                dialogEditRef.afterClosed().subscribe(res => {
                    this.banderaModalAbierto = false;
                    // console.log(res);
                    // console.log(this.banderaModalAbierto);
                });
            }else{
                this.showAlert("No se puede editar una reserva ajena");
            }
        }


        // dialogEditRef.afterClosed().subscribe(res => {
        //     if(res === 'exito'){
        //         this.solicitarReservas();
        //     }
        // });
    }

    cambioVehiculo(event: any): void {
        this.selectedVehiculo = event.value;
        this.solicitarReservas();
    }

    solicitarReservas(){
        // console.log(this.selectedVehiculo);
        if(this.selectedVehiculo == ""){
            // console.log('squiii');
            this.cabezeraTable = [];
            this.cabezeraTable = [{hora:'hora',dia:''}];
            this.cuerpoTable = [];
            return;
        }
        this.cabezeraTable  = [{hora:'hora',dia:''}];
        this.cuerpoTable = [];
        this.listaHorarios = [];
        this.listaReserva = {lunes:[], martes:[],miercoles:[],jueves:[],viernes:[],sabado:[],domingo:[]};
        this.horariosDisponibles = []; 
        let fecha = this.selectedDate.getFullYear()+'-'+(this.selectedDate.getMonth()+1).toString().padStart(2, '0')+'-'+this.selectedDate.getDate().toString().padStart(2, '0');
        let datos = {fecha, 'id_vehiculo':this.selectedVehiculo};
        let horario = new Date(fecha+'T07:00:00');
        horario.setUTCHours(6, 45, 0, 0);
        const token = localStorage.getItem('token');
        if (token) {
            const headers = new HttpHeaders().set('Authorization', token);
            this.http.post<ApiResponse>(URL+'api/bitacora',  datos , {headers})
            .pipe(
                tap(response  => {
                    this.listaReserva = response;
                    let fechaSemana = new Date(fecha+'T00:00:00');
                    Object.entries(response).forEach(([key, value]) => {
                        this.cabezeraTable.push({hora:key,dia:formatYYYYMMDD(fechaSemana)});
                        fechaSemana.setDate(fechaSemana.getDate() + 1);
                    });
                    for(let i = 0; i < 53; i++){
                        horario = new Date(horario.getTime() + 15 * 60000); // Suma 15 minutos (15 * 60000 milisegundos)
                        let horaFormato = horario.toISOString().substring(11, 19);
                        let hora, lunes, martes, miercoles, jueves, viernes, sabado, domingo;
                        let horarioLunes = response.lunes.find( element => {
                            if( element.hora_inicio == horaFormato) {
                                let horaInicio = convertirCadenaTiempoAFecha(element.hora_inicio);
                                let horaFinal = convertirCadenaTiempoAFecha(element.hora_final);
                                let i = 0;
                                horaFinal.setMinutes(horaFinal.getMinutes() -14);
                                // while(horaInicio.getHours()+':'+horaInicio.getMinutes() != horaFinal.getHours()+':'+horaFinal.getMinutes() && i < 10 ){
                                while(horaInicio < horaFinal ){   
                                    i++;
                                    horaInicio.setMinutes(horaInicio.getMinutes() + 15);
                                    let aux = Object.assign({}, element);
                                    aux['hora_inicio'] = fromDateToString(horaInicio);
                                    response.lunes.push(aux);
                                }
                            }
                            return element.hora_inicio == horaFormato;
                        });
                        if(horarioLunes === undefined){
                            lunes = 'Disponible';
                        }else{
                            lunes = 'Reservado';
                        }
                        ///////////////////
                        let horarioMartes = response.martes.find( element => {
                            if( element.hora_inicio == horaFormato) {
                                let horaInicio = convertirCadenaTiempoAFecha(element.hora_inicio);
                                let horaFinal = convertirCadenaTiempoAFecha(element.hora_final);
                                let i = 0;
                                horaFinal.setMinutes(horaFinal.getMinutes() -14);
                                // while(horaInicio.getHours()+':'+horaInicio.getMinutes() != horaFinal.getHours()+':'+horaFinal.getMinutes() && i < 10 ){
                                // while(horaInicio.getHours()+':'+horaInicio.getMinutes() != horaFinal.getHours()+':'+horaFinal.getMinutes() && i < 10 ){
                                while(horaInicio < horaFinal ){
                                    i++;
                                    horaInicio.setMinutes(horaInicio.getMinutes() + 15);
                                    let aux = Object.assign({}, element);
                                    aux['hora_inicio'] = fromDateToString(horaInicio);
                                    response.martes.push(aux);
                                }
                            }
                            return element.hora_inicio == horaFormato;
                        });
                        if(horarioMartes === undefined){
                            martes = 'Disponible';
                        }else{
                            martes = 'Reservado';
                        }
                        ///////////////////
                        let horarioMiercoles = response.miercoles.find( element => {
                            if( element.hora_inicio == horaFormato) {
                                let horaInicio = convertirCadenaTiempoAFecha(element.hora_inicio);
                                let horaFinal = convertirCadenaTiempoAFecha(element.hora_final);
                                let i = 0;
                                horaFinal.setMinutes(horaFinal.getMinutes() -14);
                                while(horaInicio < horaFinal ){
                                    i++;
                                    horaInicio.setMinutes(horaInicio.getMinutes() + 15);
                                    let aux = Object.assign({}, element);
                                    aux['hora_inicio'] = fromDateToString(horaInicio);
                                    response.miercoles.push(aux);
                                }
                            }
                            return element.hora_inicio == horaFormato;
                        });
                        if(horarioMiercoles === undefined){
                            miercoles = 'Disponible';
                        }else{
                            miercoles = 'Reservado';
                        }
                        ///////////////////
                        let horarioJueves = response.jueves.find( element => {
                            if( element.hora_inicio == horaFormato) {
                                let horaInicio = convertirCadenaTiempoAFecha(element.hora_inicio);
                                let horaFinal = convertirCadenaTiempoAFecha(element.hora_final);
                                horaFinal.setMinutes(horaFinal.getMinutes() -14);
                                let i = 0;
                                while(horaInicio < horaFinal ){
                                    horaInicio.setMinutes(horaInicio.getMinutes() + 15);
                                    let aux = Object.assign({}, element);
                                    aux['hora_inicio'] = fromDateToString(horaInicio);
                                    response.jueves.push(aux);
                                }
                            }
                            return element.hora_inicio == horaFormato;
                        });
                        if(horarioJueves === undefined){
                            jueves = 'Disponible';
                        }else{
                            jueves = 'Reservado';
                        }
                        ///////////////////
                        let horarioViernes = response.viernes.find( element => {
                            if( element.hora_inicio == horaFormato) {
                                let horaInicio = convertirCadenaTiempoAFecha(element.hora_inicio);
                                let horaFinal = convertirCadenaTiempoAFecha(element.hora_final);
                                horaFinal.setMinutes(horaFinal.getMinutes() -14);
                                while(horaInicio < horaFinal ){
                                    horaInicio.setMinutes(horaInicio.getMinutes() + 15);
                                    let aux = Object.assign({}, element);
                                    aux['hora_inicio'] = fromDateToString(horaInicio);
                                    response.viernes.push(aux);
                                }
                            }
                            return element.hora_inicio == horaFormato;
                        });
                        if(horarioViernes === undefined){
                            viernes = 'Disponible';
                        }else{
                            viernes = 'Reservado';
                        }
                        ///////////////////
                        let horarioSabado = response.sabado.find( element => {
                            if( element.hora_inicio == horaFormato) {
                                let horaInicio = convertirCadenaTiempoAFecha(element.hora_inicio);
                                let horaFinal = convertirCadenaTiempoAFecha(element.hora_final);
                                let i = 0;
                                horaFinal.setMinutes(horaFinal.getMinutes() -14);
                                while(horaInicio < horaFinal ){
                                    i++;
                                    horaInicio.setMinutes(horaInicio.getMinutes() + 15);
                                    let aux = Object.assign({}, element);
                                    aux['hora_inicio'] = fromDateToString(horaInicio);
                                    response.sabado.push(aux);
                                }
                            }
                            return element.hora_inicio == horaFormato;
                        });
                        if(horarioSabado === undefined){
                            sabado = 'Disponible';
                        }else{
                            sabado = 'Reservado';
                        }
                        ///////////////////
                        let horarioDomingo = response.domingo.find( element => {
                            if( element.hora_inicio == horaFormato) {
                                let horaInicio = convertirCadenaTiempoAFecha(element.hora_inicio);
                                let horaFinal = convertirCadenaTiempoAFecha(element.hora_final);
                                let i = 0;
                                horaFinal.setMinutes(horaFinal.getMinutes() -14);
                                while(horaInicio < horaFinal ){
                                    i++;
                                    horaInicio.setMinutes(horaInicio.getMinutes() + 15);
                                    let aux = Object.assign({}, element);
                                    aux['hora_inicio'] = fromDateToString(horaInicio);
                                    response.domingo.push(aux);
                                }
                            }
                            return element.hora_inicio == horaFormato;
                        });
                        if(horarioDomingo === undefined){
                            domingo = 'Disponible';
                        }else{
                            domingo = 'Reservado';
                        }
                        /////////// ////////
                        this.cuerpoTable.push({hora: horaFormato, lunes, martes, miercoles, jueves, viernes,  sabado, domingo});
                    }  
                }),
                finalize(() => {
                    // Realizar acciones finales después de completar la petición
                })
            )
            .subscribe(
                // error => {
                //     console.error('Error en la petición:', error);
                //     console.log('aqui');
                //     //this.router.navigate(['/']);
                // }
                );
            }
        }

    editarReserva(fila:number, columna:number):void{
        let time:string = this.cuerpoTable[fila].hora;
        let datos:cabezera = this.cabezeraTable[columna];
        let horaActual = new Date(`2000-01-01T${time}`); 
        let fechaAux = new Date('2000-01-01T00:00:00');
        let reservasDia: any[];
        console.log(datos['dia']);
        this.fechaActual = datos['dia'];
        this.horariosDisponibles = [];
        switch (datos.hora) {
            case 'lunes':
                reservasDia = this.listaReserva.lunes;
                break;
            case 'martes':
                reservasDia = this.listaReserva.martes;
                break;
            case 'miercoles':
                reservasDia = this.listaReserva.miercoles;
                break;
            case 'jueves':
                reservasDia = this.listaReserva.jueves;
                break;
            case 'viernes':
                reservasDia = this.listaReserva.viernes;
                break;
            case 'sabado':
                reservasDia = this.listaReserva.sabado;
                break;
            default:
                reservasDia = this.listaReserva.domingo;
                break;
        }
        let uniqueArray = reservasDia.filter((value, index, self) =>
            index === self.findIndex((v) => v.id_bitacora === value.id_bitacora)
        );
        // console.log(uniqueArray);
        reservasDia = uniqueArray.sort((a, b) => {
            let timeA = new Date(`2000-01-01T${a.hora_inicio}`);
            let timeB = new Date(`2000-01-01T${b.hora_inicio}`);
            return timeA.getTime() - timeB.getTime();
        });  

        let i;
        let bandera = true;
        for(i = 0; i < reservasDia.length && bandera; i++) {
            let element:bitacora = reservasDia[i];
            let horarioInicio = new Date(`2000-01-01T${element.hora_inicio}`);
            let horarioFinal = new Date(`2000-01-01T${element.hora_final}`);
            let cantHoras = new Date(`2000-01-01T00:15:00`);
            let cadena = '';
            if(horarioInicio <= horaActual && horarioFinal >= horaActual){
                horarioInicio.setSeconds(horarioInicio.getSeconds() -1);
                // console.log(horarioInicio);
                while(horarioInicio < horarioFinal && horarioInicio.getHours() < 21){
                    horarioInicio.setMinutes(horarioInicio.getMinutes()+15);
                    let auxFinal = horarioInicio.getHours().toString().padStart(2, '0')+':'+horarioInicio.getMinutes().toString().padStart(2, '0')+':59';
                    let objeto = {
                        horario_inicio: element.hora_inicio,
                        horario_final: auxFinal,
                        time,
                        tiempo: cantHoras.getHours()+' hrs. '+cantHoras.getMinutes()+' min.',
                        dia: datos.dia
                    };
                    this.horariosDisponibles.push(objeto);
                    cantHoras.setMinutes(cantHoras.getMinutes() + 15);
                }
                i++;
                horarioInicio.setMinutes(horarioInicio.getMinutes() +15 );
                if(reservasDia.length -1 >=  i){
                    let siguienteReserva:bitacora = reservasDia[i];
                    let disponible = new Date(`2000-01-01T${siguienteReserva.hora_inicio}`);
                    while(horarioInicio < disponible){
                        let auxFinal = horarioInicio.getHours().toString().padStart(2, '0')+':'+horarioInicio.getMinutes().toString().padStart(2, '0')+':59';
                        let objeto = {
                            horario_inicio: element.hora_inicio,
                            horario_final:auxFinal,
                            time,
                            tiempo:cantHoras.getHours()+' hrs. '+cantHoras.getMinutes()+' min.',
                            dia: datos.dia
                        };
                        horarioInicio.setMinutes(horarioInicio.getMinutes() + 15);
                        cantHoras.setMinutes(cantHoras.getMinutes() + 15);
                        // objeto.tiempo = fechaAux.getHours()+' hrs. '+fechaAux.getMinutes()+' min.'; 
                        this.horariosDisponibles.push(objeto);
                    } 
                }else{
                    let objeto;
                    while(horarioInicio.getHours() < 20){
                        let auxFinal = horarioInicio.getHours().toString().padStart(2, '0')+':'+horarioInicio.getMinutes().toString().padStart(2, '0')+':59';
                        objeto = {
                            horario_inicio: element.hora_inicio,
                            horario_final:auxFinal,
                            time,
                            tiempo:cantHoras.getHours()+' hrs. '+cantHoras.getMinutes()+' min.',
                            dia: datos.dia
                        };
                        horarioInicio.setMinutes(horarioInicio.getMinutes() +15 );
                        cantHoras.setMinutes(cantHoras.getMinutes() + 15);
                        this.horariosDisponibles.push(objeto);
                    }
                }
                bandera = false;
            }
        }
        let tiempo = dateToMinutes(new Date('2000-01-01T'+time));
        let dataEdit = reservasDia.filter( element  =>{
            let inicio = dateToMinutes(new Date('2000-01-01T'+element.hora_inicio));
            let final = dateToMinutes(new Date('2000-01-01T'+element.hora_final));
            return tiempo >= inicio && tiempo <= final; 
        });
        // console.log(dataEdit); 
        this.openEditDialog(dataEdit[0]);
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

    getUserUnidad(): string | null {
        const decodedToken = this.getDecodedToken();
        // console.log(decodedToken);
        return decodedToken ? decodedToken.unidad : null;
    }

    getUserID(): string | null {
        const decodedToken = this.getDecodedToken();
        // console.log(decodedToken);
        return decodedToken ? decodedToken.identificador : null;
    }

    showAlert(message: string) {
        this.snackBar.open(message, 'Cerrar', {
          duration: 2000, // Duración en milisegundos que se mostrará la alerta (opcional)
        });
    }
} 

function convertirCadenaTiempoAFecha(cadenaTiempo: string): Date {
    // Obtener la hora y los minutos de la cadena de tiempo
    const partes = cadenaTiempo.split(':');
    const horas = parseInt(partes[0], 10);
    const minutos = parseInt(partes[1], 10);
  
    // Crear un objeto Date y establecer la hora y los minutos
    const fecha = new Date();
    fecha.setHours(horas);
    fecha.setMinutes(minutos);
    fecha.setSeconds(0);
    return fecha;
}

function fromDateToString(date : Date) :string {
    date = new Date(+date);
    date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000));
    let dateAsString =  date.toISOString().substring(11, 19);
    return dateAsString;
}

function formatYYYYMMDD(date: Date) : string{
    const year = date.getFullYear(); // Obtiene el año de la fecha
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtiene el mes y lo ajusta al formato de dos dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Obtiene el día y lo ajusta al formato de dos dígitos

    let formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

function dateToMinutes(date:any) :number{
    const timestamp = Date.parse(date);
    const differenceInMinutes = (timestamp - 0) / (1000 * 60);
    return differenceInMinutes;
}
