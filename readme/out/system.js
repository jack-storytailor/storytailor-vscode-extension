let __env = require(`\.\.\\src/environment`);
let __context = { __text: [] };
let __serializer = __env.getSerializer();

__context['hyperlink'] = function (урл, текст) {
return `[${__serializer.serialize( текст, '\r\n' )}](${__serializer.serialize( урл, '\r\n' )})`;
};
__context['localPhoto'] = function (урл, текст, imgRoot) {
if (!imgRoot) { 
	imgRoot = `https:\//raw.githubusercontent.com/jack-storytailor/storytailor-vscode-extension/master/client/lib/images/`;
 };
return `![${__serializer.serialize( текст, '\r\n' )}](${__serializer.serialize( imgRoot, '\r\n' )}${__serializer.serialize( урл, '\r\n' )})`;
};


// INFO: this trick is for making this file node module
module.exports = __context;
