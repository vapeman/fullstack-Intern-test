/**
 * __filterKeys – служебная функция фильтрации ключей.
 * Возвращает объект, каждому ключу которого соответствует либо true (ключ надо расшифровать),
 * либо false (расшифровка не требуется)
 * @param { String[] } keys входные ключи объекта для проверки
 * @param { String } suffix суффикс, по которому определяется нужна дешифровка или нет
 * @param { String[] } exceptions список исключений
 * @return { Object }
 * @private
 */
function __filterKeys(keys=[], suffix='', exceptions=[]) {
    let res = {};
    for(const key of keys) {
        let shouldDecode = false;
        if(exceptions.indexOf(key) === -1) {
            let si = suffix.length - 1;
            let ki = key.length - 1;
            while(si >= 0 && ki >= 0) {
                if(key[ki] !== suffix[si]) {
                    break;
                }
                ki -= 1;
                si -= 1;
            }
            shouldDecode = si === -1 && ki !== -1;
        } else {
            shouldDecode = false;
        }
        res[key] = shouldDecode;
    }
    return res;
}

/**
 * decode – функция расшифровки
 * @param { Object[] } data массив объектов входных данных
 * @param { Object } translations словарь для расшифровки
 * @param { String[] } exceptions список исключений. Поле объекта из входных данных, ключ которого попадает в данный массив,
 * @param { String } suffix суффикс, по наличию которого в ключе отбираются поля для расшифровки. Суффикс РЕГИСТРОЗАВИСИМЫЙ
 * @return { Object[] }
 */
export function decode(data=[],
                       translations={},
                       exceptions=[],
                       suffix='') {
    const filteredKeys = __filterKeys(Object.keys(data[0]), suffix, exceptions);
    let result = [];
    for(const obj of data) {
        let resultObj = {};
        for(const key in filteredKeys) {
            let value = null;
            if(filteredKeys[key] === true) {
                if(obj[key] !== null) {
                    value = translations[obj[key]]
                }
            } else {
                value = obj[key];
            }
            resultObj[key] = value;
        }
        result.push(resultObj);
    }
    return result;
}