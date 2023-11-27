let __env = require(`\.\./src/environment`);
let __context = { __text: [] };
let __serializer = __env.getSerializer();

__context['hyperlink'] = function (урл, текст) {
__context['	'];
return `[${__serializer.serialize( текст, '\r\n' )}](${__serializer.serialize( урл, '\r\n' )})`;
};
__context['localPhoto'] = function (урл, текст, imgRoot) {
__context['	'];
if (!imgRoot) { 
	__context['		@imgRoot'] = `https:\//raw.githubusercontent.com/jack-storytailor/storytailor-vscode-extension/master/client/lib/images/`;
	__context['	'];
 };
__context['	'];
return `![${__serializer.serialize( текст, '\r\n' )}](${__serializer.serialize( imgRoot, '\r\n' )}${__serializer.serialize( урл, '\r\n' )})`;
};


// INFO: this trick is for making this file node module
Object.assign(module.exports, __context);
