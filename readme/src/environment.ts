/**
 * DON'T DESTROY THIS FILE IF YOU'RE NOT SURE WHY DO YOU NEED IT
 */

import * as basic_environment from 'storytailor/out/environment';

export let serializer = {
	serialize: function serialize(obj: any, separator: string) {
		if (obj && obj.htmlTag) {
			let tag = serialize(obj.htmlTag, separator);
			let attributes = '';
			if (obj.htmlTagAttributes) {
				attributes = serialize(obj.htmlTagAttributes, separator);
			}
			if (tag) {
				return `<${tag} ${attributes}>${basic_environment.objectToString(obj, separator)}</${tag}>`;
			}
		}

		return basic_environment.objectToString(obj, separator);
	}
};

export const getSerializer = () => {
	return serializer;
}

export const fieldsToString = (obj, separator) => {
	if (obj !== false && !obj) {
		return undefined;
	}

	let serializer = getSerializer();
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
}

export const firstLetterUp = (str, separator) => {
	str = getSerializer().serialize(str, separator) || str;

	if (!str || str === '') {
		return str;
	}

	let result = str[0].toUpperCase() + str.substr(1);
	return result;
}

export const subitemsToString = (obj, separator, headerTag, headerAttr, contentTag, contentAttr) => {
	if (!obj) {
		return undefined;
	}

	let serializer = getSerializer();

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
}

export const clearText = (context) => {
	if (!context || !context.__text) {
		return context;
	}

	return {
		...context,
		__text: []
	};
}

export const testFunction = basic_environment.testFunction;