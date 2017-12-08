import {Component} from '@nestjs/common';
import {isUndefined} from 'util';

@Component()
export class GGUtils {
  public selectFieldByObject(obj: any, fields: string[]): any {
    let res = {};
    fields.forEach(field => {
      if (!isUndefined(obj[field])) {
        res[field] = obj[field]
      }
    });
    return res;
  }

  public translit(text: string) {
    // Символ, на который будут заменяться все спецсимволы
    const space = '-';

    let TrimStr = (s) => {
      s = s.replace(/^-/, '');
      return s.replace(/-$/, '');
    };

    // Массив для транслитерации
    const transl = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
      'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
      'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': space, 'ы': 'y', 'ь': space, 'э': 'e', 'ю': 'yu', 'я': 'ya',
      ' ': space, '_': space, '`': space, '~': space, '!': space, '@': space,
      '#': space, '$': space, '%': space, '^': space, '&': space, '*': space,
      '(': space, ')': space, '-': space, '\=': space, '+': space, '[': space,
      ']': space, '\\': space, '|': space, '/': space, '.': space, ',': space,
      '{': space, '}': space, '\'': space, '"': space, ';': space, ':': space,
      '?': space, '<': space, '>': space, '№': space
    };

    let result = '';
    let curent_sim = '';

    for(let i=0; i < text.length; i++) {
      // Если символ найден в массиве то меняем его
      if(transl[text[i]] != undefined) {
        if(curent_sim != transl[text[i]] || curent_sim != space){
          result += transl[text[i]];
          curent_sim = transl[text[i]];
        }
      }
      // Если нет, то оставляем так как есть
      else {
        result += text[i];
        curent_sim = text[i];
      }
    }

    return TrimStr(result).toLowerCase();
  }
}