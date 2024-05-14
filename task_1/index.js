import {encoded, translations} from './data.js'
import {decode} from "./decode.js";
import {EXCEPTIONS, SUFFIX} from "./consts.js";


console.log('Wake up, Neo!')
// console.log(encoded, translations);
const decoded = decode(encoded, translations, EXCEPTIONS, SUFFIX);
console.log(decoded)
