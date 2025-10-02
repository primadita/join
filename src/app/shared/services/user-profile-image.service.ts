import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * Service to handle user profile images, including background color assignment
 * and generation of initials based on a user's name.
 */
export class UserProfileImageService {

    /**
   * Predefined list of background colors to assign to user profile images.
   */
  bgColorList: string[] = [
    '#008B8B',
    '#8A2BE2',
    '#CD661D',
    '#696969',
    '#228B22',
    '#8B864E',
    '#FF8C00',
    '#FFA500',
    '#FF1493',
    '#CD0000',
    '#BA55D3',
    '#FFC125',
    '#B03060',
    '#858585',
    '#483D8B',
    '#FF4040',
    '#BC8F8F',
    '#FFA54F',
    '#3CB371',
    '#EE7600',
    '#FA8072',
    '#8B0000',
    '#BF3EFF',
    '#CD9B1D',
    '#104E8B',
    '#FF7F24',
    '#708090',
    '#00CD00',
    '#FF7F50',
    '#FF8247'
  ]

    /**
   * The initials generated from the user's name.
   */
  initial!: string;

    /**
   * The background color assigned to the profile.
   */
  bgColor!: string;

    /**
   * Creates initials based on the provided full name.
   * - Uses the first letter of the first name and the first letter of the last name.
   * - If only one name is provided, only the first letter will be used.
   *
   * @param {string} name - The full name of the user.
   * @returns {string} The generated initials in uppercase.
   */
  createInitial(name:string): string {
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0];
    const last = parts.length > 1 ? parts[parts.length - 1][0]: ''; 
    const initial = first + last;
    return initial.toUpperCase();
  }

    /**
   * Selects a background color from the predefined list based on an index.
   * - Uses modulo operation to ensure the index stays within the available colors.
   *
   * @param {number} index - The index used to select a background color.
   * @returns {string} The selected background color in hex format.
   */
  getBackgroundColor(index: number): string{
    const colorId = index % this.bgColorList.length;
    return this.bgColor = this.bgColorList[colorId];
  }
}


