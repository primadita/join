import { Component, inject } from '@angular/core';
import { FirebaseServiceService } from '../../../../shared/services/firebase.service';
import { Contact } from '../../../../shared/interfaces/contact';
import { CommonModule, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-contact-label',
  standalone: true,
  imports: [CommonModule, KeyValuePipe],
  templateUrl: './contact-label.component.html',
  styleUrl: './contact-label.component.scss',
})
export class ContactLabelComponent {
  contactList = inject(FirebaseServiceService);

  /**
   * Gruppiert alle Kontakte nach dem ersten Buchstaben des Namens (A, B, C, ...).
   *
   * Rückgabe:
   * {
   *   "A": [Contact, Contact, ...],
   *   "B": [Contact, ...],
   *   ...
   * }
   *
   * Zweck:
   * - Erleichtert die Anzeige im UI nach Buchstaben-Abschnitten.
   * - In der HTML-Vorlage kann dieses Objekt mit der `keyvalue`-Pipe
   *   iteriert werden.
   */
  groupedContacts() {
    const groups: any = {};

    for (let contact of this.sortedContacts()) {
      const letter = contact.name[0].toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(contact);
    }
    return groups;
  }

  /**
   * Gibt eine alphabetisch sortierte Kopie der Kontaktliste zurück.
   * - Sortierung ist nicht groß-/kleinschreibungs­empfindlich.
   * - Originaldaten im Service bleiben unverändert (wegen `slice()`).
   */
  sortedContacts(): Contact[] {
    return this.contactList.contactsList.slice().sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }

  /**
   * Erzeugt Initialen aus dem vollständigen Namen.
   * Beispiele:
   * - "Anna Müller" -> "AM"
   * - "Jean-Paul Sartre" -> "JS" (Bindestriche/Mehrfachnamen werden unterstützt)
   */
  getLetters(contact: Contact): string {
    const splitNames = contact.name.trim().split(/[\s]+/);
    const firName = splitNames[0].charAt(0).toUpperCase();
    const lastName = splitNames[splitNames.length - 1].charAt(0).toUpperCase();

    return firName + lastName;
  }

  onActice(contact: Contact) {
    this.contactList.setActiveContact(contact.id);
  }
}
