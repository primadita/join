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
export class SectionTitleVLineComponent {
  // #region ATTRIBUTES
  @Input() sectHeader!: SectionHeader;
  // #endregion
}
