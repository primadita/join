import { Injectable } from '@angular/core';
import { SectionHeader } from '../interfaces/section-header';

@Injectable({
  providedIn: 'root'
})

/**
 * Service that provides section header information for different parts of the application.
 * 
 * Each section header includes a title and a tagline, which can be used
 * to display contextual information or headings in the UI.
 */
export class SectionHeaderService {

  constructor() { }

  /**
 * A list of predefined section headers used throughout the application.
 * Each entry contains a title and a tagline.
 */
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
