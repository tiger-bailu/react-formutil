const PATH_REGEXP = /\]\.|\]\[|\.|\[|\]/g;

function isUndefined(arg) {
    return typeof arg === 'undefined';
}

/**
 * @desc 解析表达式中赋值深路径对象
 *
 * @param {Object} target 要赋值的对象
 * @param {String} path 赋值路径，eg：list[0].title
 * @param {Any} [value] 要赋过去的值，如过不传，则返回解析路径后的值
 *
 * 使用示例：parsePath({}, 'list[0].authors[1].name', 'Lucy');
 */
/* eslint-disable */
export const parsePath = (...args) => {
    const [target, path, value] = args;
    const pathSymbols = path.match(PATH_REGEXP) || [];
    const pathWords = path.split(PATH_REGEXP).filter(item => item !== '');
    let scope = target;

    try {
        if (args.length < 3) {
            for (let index = 0, len = pathWords.length; index < len; index++) {
                let word = pathWords[index];
                const symbol = pathSymbols[index];
                const executeWord = new Function('sub', `return typeof ${word} === 'undefined' ? sub : ${word}`);

                word = executeWord(word);

                if (index + 1 === len) {
                    return scope[word];
                }

                if (isUndefined(scope[word])) {
                    break;
                }

                scope = scope[word];
            }
        } else {
            pathWords.forEach((word, index) => {
                const nextWord = pathWords[index + 1];
                const symbol = pathSymbols[index];
                const executeWord = new Function('sub', `return typeof ${word} === 'undefined' ? sub : ${word}`);
                const executeNextword = new Function(
                    'sub',
                    `return typeof ${nextWord} === 'undefined' ? sub : ${nextWord}`
                );

                word = executeWord(word);

                switch (symbol) {
                    case '].':
                    case '.':
                        scope = isUndefined(scope[word]) ? (scope[word] = {}) : scope[word];
                        break;

                    case '][':
                    case '[':
                        const nextVarWord = executeNextword(nextWord);
                        scope = isUndefined(scope[word])
                            ? (scope[word] = typeof nextVarWord === 'number' && nextVarWord >= 0 ? [] : {})
                            : scope[word];
                        break;

                    case ']':
                    default:
                        scope[word] = value;
                }
            });
        }
    } catch (error) {
        console.warn(`react-formutil: It seems '${path}' is not a legal expression.`);
    }

    if (args.length > 2) {
        return target;
    }
};

export const objectMap = (obj, handler) =>
    Object.keys(obj).reduce((newObj, key) => {
        newObj[key] = handler(obj[key], key, obj);
        return newObj;
    }, {});

export const objectEach = (obj, handler) => Object.keys(obj).forEach(key => handler(obj[key], key, obj));

export const toObject = (arr, handler, obj = {}) =>
    arr.reduce((...args) => {
        handler(...args);

        return args[0];
    }, obj);
