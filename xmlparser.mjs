function error(message) {
  throw new Error(message);
}
// "NONC" is short for "noncompliant." It indicates where this parser deviates from the XML spec.
export class XMLParser {
  /*::
  i: number
  s: string
  data: string
  tagNameStack: Array<string>
  */
  constructor(i/*: number */) {
    this.i = 0;
    this.s = '';
    this.data = '';
    this.tagNameStack = []; /* only exists for validation */
  }
  scanWhitespace() {
    for (; this.i < this.s.length; ++this.i)
      switch (this.s[this.i]) {
        case " ":
        case "\t":
        case "\n":
        case "\r":
          break;
        default:
          return;
      }
  }
  scanName()/*: string */ {
    let name = ""; 
    if (
      ":" === this.s[this.i] ||
      ("A" <= this.s[this.i] && this.s[this.i] <= "Z") ||
      "_" === this.s[this.i] ||
      ("a" <= this.s[this.i] && this.s[this.i] <= "z") ||
      ("\xC0" <= this.s[this.i] && this.s[this.i] <= "\xD6") ||
      ("\xD8" <= this.s[this.i] && this.s[this.i] <= "\xF6") ||
      ("\xC0" <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x2ff)) ||
      (String.fromCodePoint(0x370) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x37d)) ||
      (String.fromCodePoint(0x37f) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x1ff)) ||
      (String.fromCodePoint(0x200c) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x200d)) ||
      (String.fromCodePoint(0x2070) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x218f)) ||
      (String.fromCodePoint(0x2c00) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x2fef)) ||
      (String.fromCodePoint(0x3001) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0xd7ff)) ||
      (String.fromCodePoint(0xf900) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0xfdcf)) ||
      (String.fromCodePoint(0xfdf0) <= this.s[this.i] &&
        this.s[this.i] <= String.fromCodePoint(0xfffd)) ||
      (String.fromCodePoint(0x10000) <= this.s[this.i] &&
        this.s[this.i] <= String.fromCodePoint(0xeffff))
    ) {
      name += this.s[this.i];
      this.i += 1;
    } else throw new Error("Invalid Name start character");
    for (; this.i < this.s.length; ++this.i) {
      if (
        ":" === this.s[this.i] ||
        ("A" <= this.s[this.i] && this.s[this.i] <= "Z") ||
        "_" === this.s[this.i] ||
        ("a" <= this.s[this.i] && this.s[this.i] <= "z") ||
        "-" === this.s[this.i] ||
        "." === this.s[this.i] ||
        ("0" <= this.s[this.i] && this.s[this.i] <= "9") ||
        "\xB7" === this.s[this.i] ||
        ("\xC0" <= this.s[this.i] && this.s[this.i] <= "\xD6") ||
        ("\xD8" <= this.s[this.i] && this.s[this.i] <= "\xF6") ||
        ("\xC0" <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x2ff)) ||
        (String.fromCodePoint(0x370) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x37d)) ||
        (String.fromCodePoint(0x37f) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x1ff)) ||
        (String.fromCodePoint(0x200c) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x200d)) ||
        (String.fromCodePoint(0x2070) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x218f)) ||
        (String.fromCodePoint(0x2c00) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x2fef)) ||
        (String.fromCodePoint(0x3001) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0xd7ff)) ||
        (String.fromCodePoint(0xf900) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0xfdcf)) ||
        (String.fromCodePoint(0xfdf0) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0xfffd)) ||
        (String.fromCodePoint(0x10000) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0xeffff)) ||
        (String.fromCodePoint(0x0300) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x036f)) ||
        (String.fromCodePoint(0x203f) <= this.s[this.i] && this.s[this.i] <= String.fromCodePoint(0x2040))
      ) {
        name += this.s[this.i];
      } else return name;
    }
    return name;
  }
  scanLiteral() {
    // NONC: Does not implement PEReference and Reference decoding
    let start = this.s[this.i];
    if (start !== '"' && start !== "'")
      throw new Error("Invalid EntityValue start character");
    this.i++;
    let literal = "";
    for (; this.i < this.s.length; ++this.i)
      switch (this.s[this.i]) {
        default: literal += this.s[this.i]; break;
        case start: this.i += 1; return literal;
      }
    throw new Error("Unexpected EOF while scanning literal");
  }
  emitData(data/*: string*/) {}
  emitStartTag(name/*: string*/, attributes) {}
  emitEndTag(name/*: string*/) {}
  scan() {
    for (; this.i < this.s.length; ++this.i) {
      if (this.s[this.i] === "<") {
        if (this.data.length) {
          this.emitData(this.data);
        }
        this.i++;
        if (this.s[this.i] === "!") {
          this.i++;
          // NONC: CDATA
          if (this.s[this.i] === "-" && this.s[this.i + 1] === "-") {
            this.i += 2;
            for (let lastdash = false; this.i < this.s.length || error("Unexpected EOF while scanning comment literal"); ++this.i) {
              let nowdash = this.s[this.i] === "-";
              if (lastdash && nowdash) {
                if (this.s[this.i + 1] === '>') {
                  this.i++;
                  break;
                } else throw new Error("-- is not permitted in XML comments");
              }
              lastdash = nowdash;
            }
          }
        } else if (this.s[this.i] === '?') {
          this.i++;
          // NONC: Does not emit processing instructions
          for (let lastquestion = false; this.i < this.s.length || error("Unexpected EOF while scanning processing instruction"); ++this.i) {
              if (lastquestion && this.s[this.i] === '>') {
                  this.i++;
                  break;
              }
              lastquestion = this.s[this.i] === "?";;
          }
        } else if (this.s[this.i] === '/') { /* end tags */
          this.i++;
          let tagname = this.scanName();
          if (tagname !== this.tagNameStack.pop()) throw new Error("Mismatched start and end tags");
          this.emitEndTag(tagname);
        } else {
          const tagname = this.scanName();
          // NONC: Does not reject empty tag names and < x></x>
          this.scanWhitespace();
          const attributes = {};
          for (;; this.scanWhitespace()) {
            if (this.s[this.i] === '>') {
              this.emitStartTag(tagname, attributes);
              this.tagNameStack.push(tagname);
              break;
            } else if (this.s[this.i] === '/') {
              this.emitStartTag(tagname, attributes);
              this.emitEndTag(tagname);
              break;
            } else {
              let attrname = this.scanName();
              if (this.s[this.i] !== '=') throw new Error("Expected equal sign after attribute start");
              this.i++;
              let attrvalue = this.scanLiteral();
              attributes[attrname] = attrvalue;
              // attributes[this.scanName()] = this.s[this.i] !== '=' || error("Expected equal sign after attribute start"),i++,this.scanLiteral();
            }
          }
        }
      } else {
        this.data += this.s[this.i];
      }
    }
  }
}
