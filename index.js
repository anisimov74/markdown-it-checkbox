/*global module */

module.exports = function(md, options) {
  "use strict";
  md.core.ruler.push("checkbox", checkboxReplace(md, options));
};


function checkboxReplace(md, options) {
  "use strict";
  var position;
  var pattern = /\[(X|V|\s|\_|\-)\]\s(.*)/i;
  var defaults = {
    prefix: 'checkbox-'
  };
  options = Object.assign(defaults, options);

  return function(state) {
    position = 0;
    var blockTokens, i, j, l, token, tokens;
    blockTokens = state.tokens;
    j = 0;
    l = blockTokens.length;
    while (j < l) {
      if (blockTokens[j].type !== "inline") {
        j++;
        continue;
      }
      tokens = blockTokens[j].children;
      i = tokens.length - 1;
      while (i >= 0) {
        token = tokens[i];
        blockTokens[j].children = tokens = md.utils.arrayReplaceAt(tokens, i, splitTextToken(token, state.Token));
        i--;
      }
      j++;
    }
  };


  function createTokens(checked, label, Token) {
    var token = new Token("checkbox_open", "", 0);
    token.content = label;
    token.attrs = [
      ["type", "checkbox"],
      ["id", options.prefix + position],
      ["checked", checked],
      ["position", position]
    ];
    position += 1;
    return [token];
  }

  function splitTextToken(original, Token) {
    var checked, label, matches, text, value;
    text = original.content;
    matches = text.match(pattern);
    if (matches === null) {
      return original;
    }
    checked = false;
    value = matches[1];
    label = matches[2];
    if (/^[xv]$/i.test(value)) {
      checked = true;
    }
    return createTokens(checked, label, Token);
  }
}
