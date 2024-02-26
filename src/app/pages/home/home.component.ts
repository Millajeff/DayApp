import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from './../../models/task.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  tasks = signal<Task[]>([]);

  injector = inject(Injector)

  trackTask(){
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },{ injector: this.injector });
  }

  ngOnInit(){
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTask();
  }

  //Estados computados o derivados de otros
  filter = signal('all');
  taskByFilter = computed(() =>{
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending'){
      return tasks.filter(task => ! task.completed);
    }
    if (filter === 'completed'){
      return tasks.filter(task => task.completed);
    }
    return tasks;
  })

  //validacion de nuevas tareas
  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern('^\\S.*$'),
      Validators.minLength(4),
    ]
  });

  //Agregar tareas
  changeHandler() {
    if (this.newTaskCtrl.invalid || this.newTaskCtrl.value.trim() === '') {
      return;
    }
    this.addTask(this.newTaskCtrl.value.trim());
    this.newTaskCtrl.setValue('');
  }

  addTask(title: string) {
    const newtask = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newtask]);
  }

  //Eliminar Tareas
  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((task, position) => position !== index));
  }

  //Check Tarea
  updateTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    })
  }


  //Editar Tarea
  updateTasksEditingMode(index: number){
    this.tasks.update(prevState => {
      return prevState.map((task, position) => {
        if (position === index) {
          return{
            ...task,
            editing: true
          }
        }
        return{
          ...task,
          editing: false
        };
      })
    });
  }

  //Actualizar Texto de la tarea
  updateTaskText(index:number, event: Event){
    const input = event.target as HTMLInputElement;
    this.tasks.update(prevState => {
      return prevState.map((task, position) =>{
        if (position === index) {
          return{
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task;
      })
    });
  }

  //Metodo para filtrar
  changeFilter(filter: string){
    this.filter.set(filter);
  }

}
