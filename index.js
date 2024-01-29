const fs = require("fs")

class MDParser {
    constructor(options) {
        this.stylingTags = [
            "b", "i"
        ]        
    }

    MDtoHTML(md) {
        return this.parse(md)
    }

    parse(md) {
        md = this.#parseTitles(md)
        md = this.#parseBold(md)
        md = this.#parseItalic(md)
        md = this.#parseCodeBlock(md)
        // md = this.#parseCode(md)
        md = this.#parseLink(md)
        md = this.#parseImage(md)
        md = this.#parseLineDivider(md)
        md = this.#parseUnorderedList(md)
        md = this.#parseParagraphs(md)
        return md
    }

    open(mdfile) {
        return fs.readFileSync(mdfile, "utf-8")
    }

    #parseTitles(md) {
        for (const title of md.matchAll(/^(#+)(.*)$/gm)) {
            let level = title[1].length
            let content = title[2].trim()
            md = md.replace(title[0], `<h${level}>${content}</h${level}><br/>`)
        }
        return md
    }

    #parseBold(md) {
        for (const bold of md.matchAll(/\*\*(.*)\*\*/gm)) {
            let content = bold[1].trim()
            md = md.replace(bold[0], `<b>${content}</b>`)
        }
        return md
    }

    #parseItalic(md) {
        for (const italic of md.matchAll(/\*(.*)\*/gm)) {
            let content = italic[1].trim()
            md = md.replace(italic[0], `<i>${content}</i>`)
        }
        return md
    }

    #parseLineDivider(md) {
        for (const line of md.matchAll(/---/gm)) {
            md = md.replace(line[0], `<hr/>`)
        }
        return md
    }

    #parseCodeBlock(md) {
        for (const codeBlock of md.matchAll(/(```)(.|\n)*?(```)/gm)) {
            let content = codeBlock[0].slice(3, -3)
            let language = content.slice(0, content.indexOf("\n")) ?? ""
            content = content.slice(language.length).trim()
            md = md.replace(codeBlock[0], `<pre><code data-lang="${language}">${content}<code></pre>`)
        }
        return md
    }

    #parseImage(md) {
        for (const image of md.matchAll(/\!\[(.*)\]\((.*)\)/gm)) {
            let content = image[1].trim()
            let src = image[2].trim()
            md = md.replace(image[0], `<img src="${src}" alt="${content}"/>`)
        }
        return md
    }

    #parseUnorderedList(md) {
        for (const list of md.matchAll(/(\*|-)(.*)/gm)) {
            let content = list[2].trim()
            md = md.replace(list[0], `<li>${content}</li>`)
        }
        return md
    }

    #parseCode(md) {
        for (const code of md.matchAll(/`(.*)`/gm)) {
            let content = code[1].trim()
            md = md.replace(code[0], `<code>${content}</code>`)
        }
        return md
    }

    #parseLink(md) {
        for (const link of md.matchAll(/(?<!\!)\[(.*)\]\((.*)\)/gm)) {
            let content = link[1].trim()
            let href = link[2].trim()
            md = md.replace(link[0], `<a href="${href}">${content}</a>`)
        }
        return md
    }

    #parseParagraphs(md) {
        const lines = md.split('\n');
        let i = 1
        return lines.map(line => {
            console.log("Line ! ", line)
            if ((!/<\/?[^>]+(>|$)/.test(line) || this.stylingTags.includes(line.matchAll(/<\/?([^>]+)>/gm)[0][1])) && line.trim()) {
                console.log("Line matching : (", i, ")", line)
                return `<p>${line}</p>`;
            }
            i++
            return line;
        }).join('\n');
        }
}

const Parser = (options) => {
    return (new MDParser(options))
}

module.exports = Parser