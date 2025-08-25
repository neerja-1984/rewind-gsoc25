export const charFlags = {
    ' ':  0,
    '!':  0                                           | 0x02,
    '"':  0                                           | 0x02,
    '#':  0                                           | 0x02,
    '$':  0                                           | 0x02,
    '%':  0                                           | 0x02,
    '&':  0                                           | 0x02,
    '\'': 0 | 0x80                                    | 0x02,
    '(':  0,
    ')':  0,
    '*':  0                                           | 0x02,
    '+':  0                                           | 0x02,
    ',':  0                                           | 0x02,
    '-':  0                                           | 0x02,
    '.':  0                                           | 0x02,
    '/':  0                                           | 0x02,
    '0':  0                                           | 0x02 | 0x01,
    '1':  0                                           | 0x02 | 0x01,
    '2':  0                                           | 0x02 | 0x01,
    '3':  0                                           | 0x02 | 0x01,
    '4':  0                                           | 0x02 | 0x01,
    '5':  0                                           | 0x02 | 0x01,
    '6':  0                                           | 0x02 | 0x01,
    '7':  0                                           | 0x02 | 0x01,
    '8':  0                                           | 0x02 | 0x01,
    '9':  0                                           | 0x02 | 0x01,
    ':':  0                                           | 0x02,
    ';':  0                                           | 0x02,
    '<':  0                                           | 0x02,
    '=':  0                                           | 0x02,
    '>':  0                                           | 0x02,
    '?':  0                                           | 0x02,
    '@':  0                                           | 0x02,
    'A':  0 | 0x80 | 0x40,
    'B':  0 | 0x80        | 0x20        | 0x08,
    'C':  0 | 0x80        | 0x20 | 0x10,
    'D':  0 | 0x80        | 0x20        | 0x08 | 0x04,
    'E':  0 | 0x80 | 0x40,
    'F':  0 | 0x80        | 0x20,
    'G':  0 | 0x80        | 0x20 | 0x10 | 0x08,
    'H':  0 | 0x80        | 0x20,
    'I':  0 | 0x80 | 0x40,
    'J':  0 | 0x80        | 0x20 | 0x10 | 0x08 | 0x04,
    'K':  0 | 0x80        | 0x20,
    'L':  0 | 0x80        | 0x20        | 0x08 | 0x04,
    'M':  0 | 0x80        | 0x20        | 0x08,
    'N':  0 | 0x80        | 0x20        | 0x08 | 0x04,
    'O':  0 | 0x80 | 0x40,
    'P':  0 | 0x80        | 0x20,
    'Q':  0 | 0x80        | 0x20,
    'R':  0 | 0x80        | 0x20        | 0x08 | 0x04,
    'S':  0 | 0x80        | 0x20 | 0x10        | 0x04,
    'T':  0 | 0x80        | 0x20               | 0x04,
    'U':  0 | 0x80 | 0x40,
    'V':  0 | 0x80        | 0x20        | 0x08,
    'W':  0 | 0x80        | 0x20        | 0x08,
    'X':  0 | 0x80        | 0x20 | 0x10,
    'Y':  0 | 0x80 | 0x40,
    'Z':  0 | 0x80        | 0x20 | 0x10 | 0x08 | 0x04,
    '[':  0,
    '\\': 0,
    ']':  0,
    '^':  0                                           | 0x02,
    '_':  0,
    '':  0               | 0x20,
  };
  
  // Invert dictionary: flag (decimal) -> array of characters
  const flagToChars = {};
  
  for (const [char, flag] of Object.entries(charFlags)) {
    if (!(flag in flagToChars)) {
      flagToChars[flag] = [];
    }
    flagToChars[flag].push(char === ' ' ? '[space]' : char);
  }
  
  // Print the inverted mapping
  for (const [flag, chars] of Object.entries(flagToChars)) {
    console.log(`Decimal Flag: ${flag} => Characters: ${chars.join(', ')}`);
  }