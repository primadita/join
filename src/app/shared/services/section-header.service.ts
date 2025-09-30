import { Injectable } from '@angular/core';
import { SectionHeader } from '../interfaces/section-header';

@Injectable({
  providedIn: 'root'
})
export class SectionHeaderService {

  constructor() { }

  sectionHeader: SectionHeader[] = [
    {
      title: 'Contacts',
      tagline: 'Better with a team'
    },
    {
      title: 'Join 360',
      tagline: 'Key Metrics at a Glance'
    }
  ]
}
