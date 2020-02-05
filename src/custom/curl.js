module.exports = function(hljs) {
    var DOLLAR = {
        className: 'variable',
        begin: '\\$'
    };
    var QUOTE_STRING = {
        className: 'string',
        begin: /'/, end: /'/
    };
    var PROPERTY = {
        className: 'attr',
        begin: /-\D\s+/
    };
    var URL = {
        className: 'type',
        begin: /(\s|^)[^\s]*?:\/\//,
        end: /(?=(\s|$|\?))/
    };
    var QUERY = {
        className: 'meta',
        begin: /\?/,
        end: /(?=(\s|$))/
    };

    return {
        aliases: ['curl'],
        contains: [
            QUOTE_STRING,
            DOLLAR,
            PROPERTY,
            URL,
            QUERY
        ]
    };
};