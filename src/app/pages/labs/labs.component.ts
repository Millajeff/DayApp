import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  Welcome = 'Hola!';
  tasks = [
    'instalar el angular CLI',
    'crear proyecto',
    'crear componentes',
    'crear servicio'
  ]
}
