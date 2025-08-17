
const LINE_LENGTH = 150; // Width of default template text box at standard size
const ORGANIZE_ATTRIBUTES = true;

/**
 * What began as a way to fix the indentation of examples because a but of a full-on prettier for CDA XML.
 * While it doesn't do everything perfectly, it does perform the following tasks:
 * 
 *  - Indents elements consistently with 2-spaces
 *    - Comments are indented at the level of the following element 
 *      (i.e. they're indented as if they're an element themselves)
 *    - Split-element openers (long attributes) are indented
 *      to start at the same level as the first attribute of the element
 *  - Unnecessary line breaks in text content is removed
 *  - Long element-openers are split into multiple lines
 *  - When processing a long element opener or a multi-line element opener,
 *    preference is given to a few attributes (xsi:type, code, codeSystem, value)
 *    on the first line, followed by additional lines, with each line
 *    remaining under the maximum line length.
 * 
 * Known limitations:
 *  - Does not split long lines of text content (apart from opening elements)
 *  - Doesn't always detect closing elements of parent tags if included on a child line
 *  - Elements whose attributes split multiple lines are assumed to not have the closing element on the same line
 *  - Tries to detect > within quotes, but also assumes lines area actually quoted well
 * 
 * TODOs:
 *  - Make sure namespace attributes are pulled to the root element (and are included) (though that's lint-ey, not formatting)
 * 
 * @param {*} xmlString 
 * @returns 
 */


const prettyCDA = (xmlString) => {
  const originalLines = xmlString.split('\n');
  const newLines = [];

  const stack = [];
  let startComment = false;
  let inComment = false;
  let commentStackLevel = 0;
  let psComment = '';

  const indent = (addIndent = 0) => (stack.length + addIndent + (inComment ? 2.5 : 0)) * 2;
  const addLine = (text, addIndent = 0) => {
    const preComment = startComment ? '<!--' : '';
    newLines.push(' '.repeat(indent(addIndent)) + [preComment, restoreGtInQuotes(text), psComment].filter(Boolean).join(' '));
    psComment = '';
    if (inComment && text.endsWith('-->')) {
      endComment();
    }
    if (startComment) {
      startComment = false;
      inComment = true;
      commentStackLevel = stack.length;
    }
  };
  const endComment = () => {
    inComment = false;
    if (commentStackLevel > 0) {
      stack.length = commentStackLevel;
      commentStackLevel = 0;
    }
  }

  // WAY-too complicated function for a brief idea I had...
  // Auto-splits long attributes; combines attribute lists; and
  // normalizes the order that code / value attributes appear in
  const organizeAttributes = (trimmed, line) => {
    if (!ORGANIZE_ATTRIBUTES) return 0; // Skip if not enabled
    const openTag = trimmed.match(/^<(\w+(?::\w+)?)\s?([^>]*)(?:(\/?>)(.*)|$)/);
    if (!openTag) return 0;

    const tagName = openTag[1];
    let attributes = openTag[2].trim();
    let tagEndsInBracket = openTag[3]?.endsWith('>');
    let selfClose = openTag[3]?.endsWith('/>');
    const afterTag = openTag[4] ? openTag[4].trim() : '';
    // short enough by itself? Don't mess with it
    if (tagEndsInBracket && trimmed.length + indent() < LINE_LENGTH) return 0;

    // Parse all attributes into a Map
    if (!attributes) return 0;
    const attrRegex = /(\w+(?::\w+)?)="([^"]+)"/g;
    let attrMatches = {}; // as Record<string, string>
    let match;
    while ((match = attrRegex.exec(attributes)) !== null) {
      const key = match[1];
      const value = match[2];
      attrMatches[key] = value;
    }
    if (Object.keys(attrMatches).length > 0) {
      attributes = attributes.replace(attrRegex, '').replace(/\s{2,}/g, ' ').trim();
    }
    if (attributes.includes('/')) selfClose = true;
    // Grab next lines!
    let nextLineIndex = line;
    if (!tagEndsInBracket) {
      while (++nextLineIndex < originalLines.length) {
        if (nextLineIndex > line + 5) return 0; // Safety early exit
        const nextLineMatch = originalLines[nextLineIndex].trim().match(/([^>]+)(\/?>|$)/);
        if (!nextLineMatch) return 0; // Malformed tag - give up
        let nextLineAttributes = nextLineMatch[1].trim();

        let nextMatch;
        while ((nextMatch = attrRegex.exec(nextLineAttributes)) !== null) {
          const key = nextMatch[1];
          const value = nextMatch[2];
          attrMatches[key] = value;
          nextLineAttributes = nextLineAttributes.replace(nextMatch[0], '').trim();
          attrRegex.lastIndex = 0; // Reset regex state
        }
        if (nextLineAttributes) {
          if (nextLineAttributes === '/') {
            selfClose = true;
          } else {
            console.log('Found extra stuff on line after attributes:', nextLineAttributes);
            return 0;
          }
        }
        if (nextLineMatch[2].includes('/')) selfClose = true;
        if (nextLineMatch[2].endsWith('>')) {
          tagEndsInBracket = true;
          break;
        }
      }
    }

    // Um, no attributes, but we made it this far? Something went wrong
    if (Object.keys(attrMatches).length === 0) return 0;

    // Now output
    const attrLines = [''];
    let preferredAttrsFound = false;
    // If we have xsi:type, code, or value attributes, print on first line
    const preferredAttrs = ['xsi:type', 'code', 'codeSystem', 'value'];
    preferredAttrs.forEach(attr => {
      if (attr in attrMatches) {
        attrLines[0]+=(` ${attr}="${attrMatches[attr]}"`);
        preferredAttrsFound = true;
        delete attrMatches[attr];
      }
    });
    // Divide the rest of the attributes into lines of max LINE_LENGTH
    //attrLines[0].length ? attrLines.push('') : attrLines[0] = ' '; // Ensure we have a line to append to
    //if (attrLines[0].length) attrLines.push('');
    for (const [key, value] of Object.entries(attrMatches)) {
      const attr = ` ${key}="${value}"`;
      // If we already added preferred attributes, start a new line
      // Otherwise, only start if this would cause the previous line to exceed LINE_LENGTH
      const needNewLine = attrLines.length === 1 && preferredAttrsFound ||
        attrLines[attrLines.length -1] && attrLines[attrLines.length - 1].length + attr.length + indent(1) > LINE_LENGTH;
      if (needNewLine) {
        attrLines.push(attr.trim());
      } else {
        attrLines[attrLines.length - 1] += attr; //`${attrLines[attrLines.length-1] ? ' ' : ''}${attr}`;
      }
    }

    // Close the last line
    if (selfClose) {
      attrLines[attrLines.length - 1] += ' />';
    } else {
      attrLines[attrLines.length - 1] += '>';
    }

    addLine(`<${tagName}${attrLines[0]}`);
    for (let i = 1; i < attrLines.length; i++) {
      addLine(attrLines[i], tagName.length / 2 + 1);
    }

    if (!selfClose) {
      stack.push(tagName);
    }
    if (afterTag) {
      newLines[newLines.length - 1] += afterTag;
    }

    return nextLineIndex - line + 1; // Return how many lines we consumed
  }

  // I like for of loops, but we're going to mess with the index sometimes
  for (let i = 0; i < originalLines.length; i++) {

    let trimmed = replaceGtInQuotes(originalLines[i].trim());

    // Empty line - just add (but only one)
    if (trimmed === '') {
      // Only add one blank line in a row
      if (newLines.length > 0 && newLines[newLines.length-1].trim() !== '') {
        addLine(trimmed);
      }
      continue;
    }

    // Put closing comment on previous line if it's not too long and the previous line isn't an XML tag
    if (trimmed === '-->' && inComment && newLines.length > 0 && newLines[newLines.length - 1].length + trimmed.length < LINE_LENGTH - 40 && !newLines[newLines.length -1].endsWith('>')) {
      newLines[newLines.length - 1] += ' -->';
      endComment();
      continue;
    }

    if (trimmed.startsWith('<!--')) {
      // Single-line comment? Just add
      if (trimmed.endsWith('-->')) {
        addLine(trimmed);
        continue;
      }
      // Remove the <!-- and treat it like any other content
      startComment = true; // Tells the next call to "addLine" to start a comment
      trimmed = trimmed.slice(4).trim(); // Remove the <!--
    }

    // If we have a trailing comment on a line, split it off
    // (will be saved with the next call to addLine)
    // ({0, 100} - disable this if line is too long)
    const commentMatch = trimmed.match(/(.{0,200}?)(\s*<!--.*-->)$/);
    if (commentMatch) {
      trimmed = commentMatch[1].trim();
      psComment = commentMatch[2].trim();
    }

    //<anything /> - just output the line with the current spacing
    if (trimmed.match(/^<[^>]+\/>([^<]*|$)/)) {
      const linesConsumed = organizeAttributes(trimmed, i);
      if (linesConsumed > 0) {
        i += linesConsumed - 1; // Adjust index to skip the lines we consumed
      } else addLine(trimmed);
      continue;
    }

    //<something ...> Anything </something> - do the same thing
    if (trimmed.match(/^<(\w+(?::\w+)?)[^>]*>.*<\/\1>$/)) {
      addLine(trimmed);
      continue;
    }

    // TODO - <element><someChild /> screws this up, but solving isn't trivial
    ///> - output, then pop
    if (trimmed.endsWith('/>')) {
      addLine(trimmed);
      if (stack.length > 0) {
        stack.pop();
      }
      continue;
    }

    // </close> ... look for close in the stack; remove till then, then output
    const closeTag = trimmed.match(/^<\/(\w+(?::\w+)?)>.*$/);
    if (closeTag) {
      const tagName = closeTag[1];
      while (stack.length > 0 && stack[stack.length - 1] !== tagName) {
        stack.pop();
      }
      if (stack.length > 0) {
        stack.pop();
      }
      if (newLines[newLines.length - 1].trim().startsWith(`<${tagName}`) && !newLines[newLines.length - 1].endsWith(`/${tagName}>`) && !inComment && !startComment) {
        newLines[newLines.length - 1] += trimmed;
      } else {
        addLine(trimmed);
      }
      continue;
    }

    // <open ...  - output the line, then push to stack
    const openTag = trimmed.match(/^<(\w+(?::\w+)?)\s?([^>]*)(>|$)/);
    if (openTag) {
      const linesConsumed = organizeAttributes(trimmed, i);
      if (linesConsumed > 0) {
        i += linesConsumed - 1; // Adjust index to skip the lines we consumed
        continue;
      }

      addLine(trimmed);
      if (!trimmed.endsWith('/>')){
        stack.push(openTag[1]);
      }
      continue;

      // // Old behavior (can probably simplify the xsi:type/code stuff)
      // const tagName = openTag[1];
      // let tagLineRemaining = '';
      // let attributes = openTag[2].trim();
      // const tagEndsInBracket = openTag[3].endsWith('>');
      // // If it doesn't end with a bracket, that means attributes are continued on the next line
      // // For consistency's sake, move ALL attributes to the next line
      // const attrRegex = /\b(xsi:type|code|codeSystem)="[^"]*"/g;
      // let attrMatches = [];
      // let match;
      // while ((match = attrRegex.exec(attributes)) !== null) {
      //   attrMatches.push(match[0]);
      // }
      // if (attrMatches.length > 0) {
      //   tagLineRemaining += ' ' + attrMatches.join(' ');
      //   attributes = attributes.replace(attrRegex, '').replace(/\s{2,}/g, ' ').trim();
      // }
      // // (TODO - keep the xsi-type on the same line if it exists)
      // if (!tagEndsInBracket && attributes.length > 0) {
      //   addLine(`<` + tagName + tagLineRemaining);
      //   addLine(attributes, 1);
      // } else {
      //   addLine(trimmed);
      // }
      // stack.push(tagName);
      // continue;
    }

    // Remaining - print with current spacing plus extra indent

    // Remove unnecessary line breaks
    // unless the preceding line ends in a comment
    if (newLines.length > 0 && newLines[newLines.length-1].length + trimmed.length < LINE_LENGTH && !newLines[newLines.length-1].endsWith('-->') && !inComment && !startComment) {
      const addSpace = newLines[newLines.length-1].endsWith('>') ? '' : ' ';
      newLines[newLines.length-1] += addSpace + trimmed;
    } else {
      addLine(trimmed);
    }

    // But if it ends with a </closing>, pop from stack
    const closingTag = trimmed.match(/<\/(\w+)>$/);
    if (closingTag) {
      const tagName = closingTag[1];
      if (stack.length > 0 && stack[stack.length - 1] === tagName) {
        stack.pop();
      }
    }
  }

  return newLines.join('\n');
}

/**
 * Replaces any '>' character inside double quotes with '〉'.
 * Does not affect '>' characters outside of double quotes.
 * @param {string} xmlString
 * @returns {string}
 */
function replaceGtInQuotes(xmlString) {
  let inQuotes = false;
  let inComment = false;
  let result = '';
  for (let i = 0; i < xmlString.length; i++) {

    // People are always messing up quotes in comments... so ignore those
    if (xmlString[i] === '<' && xmlString.substring(i, i + 4) === '<!--') {
      inComment = true;
    } else if (inComment && xmlString.substring(i, i + 3) === '-->') {
      inComment = false;
    }
    if (inComment) {
      result += xmlString[i];
      continue;
    }
    const char = xmlString[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      result += char;
    } else if (char === '>' && inQuotes) {
      result += '〉';
    } else {
      result += char;
    }
  }
  return result;
}
function restoreGtInQuotes(xmlString) {
  return xmlString.replace(/〉/g, '>');
}


module.exports = {
  prettyCDA
}
