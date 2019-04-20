"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment = require("storytailor/out/environment");
exports.getSerializer = () => {
    return {
        serialize: (obj, separator) => {
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
exports.testFunction = environment.testFunction;
//# sourceMappingURL=environment.js.map