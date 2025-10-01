import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserProfileImageService {
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
  initial!: string;
  bgColor!: string;

  createInitial(name:string): string {
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0];
    const last = parts.length > 1 ? parts[parts.length - 1][0]: ''; 
    const initial = first + last;
    return initial.toUpperCase();
  }

  getBackgroundColor(index: number): string{
    const colorId = index % this.bgColorList.length;
    return this.bgColor = this.bgColorList[colorId];
  }
}


