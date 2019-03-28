import * as environment from 'storytailor/out/environment';

export const getSerializer = () => {
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
  }
}

export const testFunction = environment.testFunction;