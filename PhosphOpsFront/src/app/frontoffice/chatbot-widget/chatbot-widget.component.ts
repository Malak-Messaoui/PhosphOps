import { Component, signal, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.css']
})
export class ChatbotWidgetComponent implements AfterViewChecked {
  isOpen = signal(false);
  loading = signal(false);
  inputText = '';

  messages = signal<ChatMessage[]>([
    { role: 'bot', text: 'Bonjour 👋 Je suis l\'assistant PhosphOps. Comment puis-je vous aider ?' }
  ]);

  constructor(private aiService: AiService) {}

  ngAfterViewChecked(): void {
    // Réaffiche les icônes lucide après chaque changement du DOM (ouverture/fermeture)
    (window as any).lucide?.createIcons();
  }

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  send(): void {
    const text = this.inputText.trim();
    if (!text || this.loading()) return;

    this.messages.update(msgs => [...msgs, { role: 'user', text }]);
    this.inputText = '';
    this.loading.set(true);

    this.aiService.chat(text).subscribe({
      next: (res) => {
        this.messages.update(msgs => [...msgs, { role: 'bot', text: res.reponse }]);
        this.loading.set(false);
      },
      error: () => {
        this.messages.update(msgs => [
          ...msgs,
          { role: 'bot', text: 'Désolé, une erreur est survenue. Réessayez plus tard.' }
        ]);
        this.loading.set(false);
      }
    });
  }
}