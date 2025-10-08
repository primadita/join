import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { SectionHeaderService } from '../../services/section-header.service';
import { SectionHeader } from '../../interfaces/section-header';

@Component({
  selector: 'app-section-title-vline',
  imports: [CommonModule],
  templateUrl: './section-title-vline.component.html',
  styleUrl: './section-title-vline.component.scss'
})

/**
 * Component for displaying a section title with a vertical line.
 */
export class SectionTitleVLineComponent {
  // #region ATTRIBUTES
  /**
   * Section header data to display.
   */
  @Input() sectHeader!: SectionHeader;
  // #endregion
}
