import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'app-editprod',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editprod.component.html',
  styleUrls: ['./editprod.component.scss']
})
export class EditProdComponent implements OnInit {
  @Input() produit: any;
  @Output() close = new EventEmitter<void>();
  @Output() produitModifie = new EventEmitter<any>();

  editForm!: FormGroup;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl(this.produit?.name, Validators.required),
      description: new FormControl(this.produit?.description),
      price: new FormControl(this.produit?.price, [Validators.required, Validators.min(1)]),
      image: new FormControl(this.produit?.image, Validators.required)
    });
  }

onSubmit() {
  if (this.editForm.invalid) return;

  const updated = {
    ...this.produit,
    ...this.editForm.value
  };

  this.requestService.post(`products/update/${this.produit.id}`, updated)
    .subscribe({
      next: (res: any) => {
        this.produitModifie.emit(res);
        this.fermer();
      },
      error: (err) => console.error(err)
    });
}


  fermer() {
    this.close.emit();
  }
}
