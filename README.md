# streamingjsxmlparser
An efficient XML parser for JS. Implements part of [the XML specification.](https://www.w3.org/TR/xml/)

* Streaming: This algorithmic 

Rationale: This parser does not build a tree, which causes memory allocation and creates GC pressure. Instead, it parses in a stream, looking at it character-by-character. Modern superscalar CPUs are very efficient at those types of operations.


## How to use it

Streaming APIs are used by building an internal state and collecting information as you traverse the tree.

### Example

```
import { XMLParser } from './xmlparser.mjs'
class MyParser extends XMLParser {
  emitData(data) {
     console.log("Encountered data:", JSON.stringify(data))
     this.data = '' // mark data as processed
  }
  emitStartTag(name, attributes) {
     console.log("Encountered a start tag:", name, attributes)
  }
  emitEndTag(name) {
     console.log("Encountered an end tag:", name)
  }
}
```

Results in:

```
Encountered a start tag: html {}
Encountered a start tag: head {}
Encountered a start tag: title {}
Encountered data: "Test"
Encountered an end tag: title
Encountered an end tag: head
Encountered data: "\n            "
Encountered a start tag: body {}
Encountered a start tag: h1 { key: 'value' }
Encountered data: "This is a heading!"
Encountered an end tag: h1
Encountered an end tag: body
Encountered an end tag: html
```

### Tips and tricks

Using a streaming parser is like writing a for loop over all events. 

## Warning

This is not an HTML parser. HTML is more complex, because it supports features such as:

 - Self-closing tags: `<p>a<p>b` turns into `<p>a</p><p>b</p>` because `p` is a self-closing tag.
 - Quoteless attributes: `<h1 class=heading>` works as well as `<h1 class="heading">`.
