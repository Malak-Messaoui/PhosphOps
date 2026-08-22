import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, DiagnosticResponse } from '../../services/ai.service';
import { NavbarComponent } from "../navbar/navbar.component";
@Component({
  selector: 'app-diagnostic',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.css']
})
export class DiagnosticComponent {
  description = '';
  result = signal<DiagnosticResponse | null>(null);
  loading = signal(false);
  error = signal('');

  constructor(private aiService: AiService) {}

  analyser(): void {
    if (!this.description.trim()) return;

    this.loading.set(true);
    this.error.set('');
    this.result.set(null);

    this.aiService.diagnostic(this.description).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de générer un diagnostic pour le moment. Réessayez.');
        this.loading.set(false);
      }
    });
  }
}