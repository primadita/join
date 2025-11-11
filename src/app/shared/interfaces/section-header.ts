/**
 * Represents header content for a page section or view.
 *
 * Used to display a consistent section heading with a supplementary tagline
 * or subtitle. Typically appears at the top of a page or major section.
 *
 * @interface SectionHeader
 */
export interface SectionHeader {
  /**
   * The main heading text.
   * Should be clear and descriptive of the section content.
   * Examples: "Contacts", "Task Details", "Summary"
   * @type {string}
   */
  title: string;

  /**
   * A supplementary subtitle or tagline.
   * Provides additional context or instruction to the user.
   * Examples: "Manage your contacts", "View your tasks", "See your progress"
   * @type {string}
   */
  tagline: string;
}
