let __env = require(`./environment`);
let __context = { __text: [] };
let __serializer = __env.getSerializer();

__context['hyperlink'] = function (урл, текст) {
return `[${__serializer.serialize( текст, '\r\n' )}](${__serializer.serialize( урл, '\r\n' )})`;
};
__context['localPhoto'] = function (урл, текст, imgRoot) {
if (!imgRoot) { 
	imgRoot = `https:\//raw.githubusercontent.com/freewebtime/storyscript-vscode-extension/master/client/lib/images/`;
 };
return `![${__serializer.serialize( текст, '\r\n' )}](${__serializer.serialize( imgRoot, '\r\n' )}${__serializer.serialize( урл, '\r\n' )})`;
};


// INFO: this trick is for making this file node module
export default __context
module.exports = {...__context}
