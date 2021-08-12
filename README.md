# streamingjsxmlparser
An efficient XML parser for JS. Implements part of [the XML specification.](https://www.w3.org/TR/xml/)

* Streaming: This algorithmic 

Rationale: This parser does not build a tree, which causes memory allocation and creates GC pressure. Instead, it parses in a stream, looking at it character-by-character. Modern superscalar CPUs are very efficient at those types of operations.


## How to use it

Streaming APIs are used by building an internal state and collecting information as you traverse the tree.

```
class MyParser extends XMLParser {
  emitData(data) {
     console.log("Encountered content: ", content)
  }
  emitStartTag(name, attributes) {
     console.log("Encountered a start tag: ", name, attributes)
  }
  emitEndTag(name) {
     console.log("Encountered an end tag: ", name)
  }
}
```

