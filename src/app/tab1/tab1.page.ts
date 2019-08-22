import { Component, OnInit, NgModule } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AlertController, NavController} from '@ionic/angular'
import { EmergenciaService } from '../emergencia.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{
  // ngOnInit(): void {
  //   throw new Error("Method not implemented.");
  // }
  private idEmergencia: number;
  private diagnosticoEmergencia: string;
  private latitudEmergencia: number;
  private longitudEmergencia: number;
  private sintomasEmergencia: string;
  private equiposEmergencia: string;
  private movilAmbulancia: number;
  private latitudAmbulancia: number;
  private longitudAmbulancia: number;
  private hospitalCercano: string;

  Emergencia = null; 


  private origenE: string;
  private destinoE: string;  
  form: FormGroup;
  formComentarios: FormGroup;
  map: Map;
  
  // Validation error messages that will be displayed for each form field with errors.
  validation_messages = {
    'origenE' : [
      { type: 'pattern', message: 'Debe ingresar un origen para la emergencia'}
    ],
    'destinoE' : [
      { type: 'pattern', message: 'Debe ingresar un destino para la emergencia'}
    ],
    'comentarioE' : [
      { type: 'pattern', message: 'Debe ingresar un comentario para la emergencia'}
    ]
  }

  constructor(public formBuilder: FormBuilder, public alertController:AlertController, public navCtrl: NavController, public emergenciaService: EmergenciaService) {
    this.form = this.formBuilder.group({
      origenE: ['', Validators.pattern('-?[0-9]+.[0-9]+,-?[0-9]+.[0-9]+')],
      destinoE: ['', Validators.pattern('-?[0-9]+.[0-9]+,-?[0-9]+.[0-9]+')]
    });
    this.formComentarios = this.formBuilder.group({
      comentarioE: ['', Validators.pattern('[a-zA-Z0-9 ]*')]
    })
    this.cargarEmergencia();
  }

  ionViewDidEnter() { this.leafletMap(); }

  leafletMap() {
    // // In setView add latLng and zoom
    // this.map = new Map('mapId').setView([28.644800, 77.216721], 10);
    // tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    //   attribution: 'edupala.com © ionic LeafLet',
    // }).addTo(this.map);
    this.map = new Map('mapId').setView([5.043906, -75.514716], 30);
    tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'SAMU-EMS'
    }).addTo(this.map);


    marker([5.043894, -75.514619]).addTo(this.map)
      .bindPopup('Emergencia <br> Origen.')
      .openPopup();

    marker([5.046825, -75.515290]).addTo(this.map)
      .bindPopup('Emergencia <br> Destino.')
      .openPopup();
  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    this.map.remove();
  }

   /*
   * Save form values.
   */
  save() {
    console.log("guardar datos");
    if ((this.form.valid) && (this.form.get('origenE').value != '') && (this.form.get('destinoE').value != '')) {
      // Save your values, using this.form.get('myField').value;
      this.origenE = this.form.get('origenE').value;
      this.destinoE = this.form.get('destinoE').value; 
      //Obtener las coordenadas del origen de la emergencia
      var splitted = this.origenE.split(",", 2); 
      let latitudO=splitted[0];
      console.log("latitud origen " +latitudO);
      let longitudO=splitted[1];
      console.log("longitud origen " +longitudO);
      //Obtener las coordendas del destino de la emergencia
      var splitted = this.destinoE.split(",", 2); 
      let latitudD=splitted[0];
      console.log("latitud destino " +latitudD);
      let longitudD=splitted[1];
      console.log("longitud destino " +longitudD);
      //Utilizar la instacncia de mapa ya definida para graficar una nueva ubucacion con los datos recibidos 
      this.map.setView([parseFloat(latitudO), parseFloat(longitudO)], 30);
      tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'SAMU-EMS'
      }).addTo(this.map);

      marker([parseFloat(latitudO), parseFloat(longitudO)]).addTo(this.map)
        .bindPopup('Emergencia <br> Origen.')
        .openPopup();

      marker([parseFloat(latitudD), parseFloat(longitudD)]).addTo(this.map)
        .bindPopup('Emergencia <br> Destino.')
        .openPopup();
    }else {
      console.log("No se pudo validar");
    }
  }

  terminarE(idEmergencia){
    console.log("Emergencia " + idEmergencia);
    console.log("comentarios " +this.formComentarios.get('comentarioE').value);    
  }

  cargarEmergencia(){
    this.emergenciaService.getEmergencia(1).subscribe((data)=>{
      console.log("Emergencia "+data.lat);
      this.Emergencia=data;
      this.latitudEmergencia=parseFloat(data.lat);
      this.longitudEmergencia=parseFloat(data.lon);
      this.latitudAmbulancia=parseFloat(data.latOrigen);
      this.longitudAmbulancia=parseFloat(data.lonOrigen);   
      this.map.setView([this.latitudAmbulancia, this.longitudAmbulancia], 30);
      tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'SAMU-EMS'
      }).addTo(this.map);

      marker([this.latitudAmbulancia, this.longitudAmbulancia]).addTo(this.map)
        .bindPopup('Emergencia <br> Origen.')
        .openPopup();

      marker([this.latitudEmergencia, this.longitudEmergencia]).addTo(this.map)
        .bindPopup('Emergencia <br> Destino.')
        .openPopup(); 
    },
    (error=>{
      console.log(error);
    })
    )
  }
}
