
/**
 * Represents a contact entry with personal information and optional UI attributes.
 */
export interface Contact {
  name: string;
  mail: string;
  phone: string;
  id: string;
  initials?: string;
  bgColor?: string;
  active: boolean;
}
