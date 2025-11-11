
/**
 * Represents a contact entry with personal information and optional UI attributes.
 *
 * Contacts are used throughout the application for task assignment, team collaboration,
 * and contact management. Each contact is stored in Firestore and can be displayed with
 * an auto-generated avatar using initials and a background color.
 *
 * @interface Contact
 */
export interface Contact {
  /**
   * Full name of the contact.
   * Used for display, search, and sorting. Typically formatted as "First Last".
   * @type {string}
   */
  name: string;

  /**
   * Email address of the contact.
   * Should be a valid email format (though validation may occur elsewhere).
   * @type {string}
   */
  mail: string;

  /**
   * Phone number of the contact.
   * Format is flexible (can include country codes, spaces, etc.).
   * @type {string}
   */
  phone: string;

  /**
   * Unique identifier assigned by Firestore.
   * Used internally for lookups, updates, and deletions.
   * @type {string}
   */
  id: string;

  /**
   * Computed or cached initials of the contact (typically 1-2 uppercase letters).
   * Generated from the first and last letters of the name.
   * Used for avatar display when no image is available.
   * @type {string | undefined}
   * @optional
   */
  initials?: string;

  /**
   * Background color for the contact's avatar.
   * Format: hex color code (e.g., "#FF5733") or CSS color name.
   * Assigned automatically based on the contact's position in the list
   * to ensure visually distinct avatars.
   * @type {string | undefined}
   * @optional
   */
  bgColor?: string;

  /**
   * Flag indicating whether this contact is currently selected or active.
   * Used by the UI to highlight the active contact in lists.
   * @type {boolean | undefined}
   * @optional
   * @default false
   */
  active?: boolean;
}
