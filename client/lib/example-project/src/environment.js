"use strict";
/**
 * DON'T DESTROY THIS FILE IF YOU'RE NOT SURE WHY DO YOU NEED IT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const environment = require("storytailor/out/environment");
exports.getSerializer = () => {
    return {
        serialize: (obj, separator) => {
            if (obj === 0) {
                return obj.toString();
            }
            if (!obj) {
                return undefined;
            }
            if (obj.htmlTag) {
                let tag = environment.objectToString(obj.htmlTag, separator);
                let attributes = environment.objectToString(obj.htmlTagAttributes, separator);
                if (tag) {
                    return `<${tag} ${attributes}>${environment.objectToString(obj, separator)}</${tag}>`;
                }
            }
            return environment.objectToString(obj, separator);
        }
    };
};
exports.fieldsToString = (obj, separator) => {
    if (!obj) {
        return undefined;
    }
    let serializer = exports.getSerializer();
    let result = serializer.serialize(obj, separator);
    if (!result) {
        let fields = [];
        for (let key in obj) {
            let field = obj[key];
            if (field) {
                let str = serializer.serialize(field, separator);
                if (str) {
                    str = `${key}:${separator}* ${str}`;
                    fields = [...fields, str];
                }
            }
        }
        result = serializer.serialize(fields, separator);
    }
    return result;
};
exports.firstLetterUp = (str, separator) => {
    str = exports.getSerializer().serialize(str, separator) || str;
    if (!str || str === '') {
        return str;
    }
    let result = str[0].toUpperCase() + str.substr(1);
    return result;
};
exports.subitemsToString = (obj, separator, headerTag, headerAttr, contentTag, contentAttr) => {
    if (!obj) {
        return undefined;
    }
    let serializer = exports.getSerializer();
    let headerPrefix = '';
    let headerPostfix = '';
    if (headerTag) {
        headerPrefix = `<${headerTag} ${headerAttr || ''}>`;
        headerPostfix = `</${headerTag}>`;
    }
    let contentPrefix = '';
    let contentPostfix = '';
    if (contentTag) {
        contentPrefix = `<${contentTag} ${contentAttr || ''}>`;
        contentPostfix = `</${contentTag}>`;
    }
    let result = [];
    for (const key in obj) {
        if (!obj.hasOwnProperty(key) || key === "__text") {
            continue;
        }
        const item = obj[key];
        const contentText = `${contentPrefix}${serializer.serialize(item, separator)}${contentPostfix}`;
        const headerText = `${headerPrefix}${key}${headerPostfix}`;
        const itemText = `${headerText}${separator || ''}${contentText}`;
        result = [...result, itemText];
    }
    let resultText = result.join(separator);
    return resultText;
};
exports.clearText = (context) => {
    if (!context || !context.__text) {
        return context;
    }
    return Object.assign({}, context, { __text: [] });
};
exports.testFunction = environment.testFunction;
//# sourceMappingURL=environment.js.map