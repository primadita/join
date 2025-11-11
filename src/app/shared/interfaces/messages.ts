/**
 * Represents a toast message (temporary notification) shown to the user.
 *
 * Toast messages provide feedback for user actions such as successful saves,
 * error notifications, or confirmation of deletions. They appear briefly
 * and automatically disappear after a set duration (typically 3 seconds).
 *
 * @interface Messages
 */
export interface Messages {
  /**
   * The main text content of the toast message.
   * Should be concise and user-friendly.
   * Examples: "Task created successfully", "Failed to save contact"
   * @type {string}
   */
  text: string;

  /**
   * The type/category of the message determining styling and icon.
   * - 'success': positive feedback (green styling)
   * - 'error': error or warning (red styling)
   * @type {'success' | 'error'}
   */
  type: 'success' | 'error';

  /**
   * Optional URL to an image or icon displayed with the message.
   * Can be used for custom visual feedback.
   * @type {string | undefined}
   * @optional
   */
  imgUrl?: string;
}
