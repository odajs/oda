ODA({imports: '@oda/ace-editor',
    is: "oda-xml-editor",
    extends: 'oda-ace-editor',
    // template:`<!--<script src="./sax-min.js"></script>-->`,
    props: {
        mode: 'xml',
        xml: {
            type: String,
            set(xml) {
                this._parseXML(xml);
            }
        }
    },
    _parseXML(xml) {
        if (!window.sax) {
            return new Promise(resolve => {
                const script = document.createElement('script');
                script.src = '/web/oda/components/editors/xml-editor/sax-min.js';
                script.onload = () => resolve(this._parseXML(xml));
                document.head.appendChild(script);
            });
        }
        return new Promise((resolve) => {
            if (!xml) this.value = '';

            try {
                const parser = sax.parser(true);
                parser.level = 0;
                let res = ``;
                parser.indent = () => {
                    res += ' '.repeat(parser.level * 4);
                };

                function entity(str) {
                    return str.replace(/"/g, '&quot;')
                }

                parser.onprocessinginstruction = function (e) {
                    res += `<?${e.name} ${e.body}?>`;
                };

                parser.onopentag = function (tag) {
                    this.indent();
                    res += ('<' + tag.name);

                    for (let i in tag.attributes) {
                        res += ' ' + i + '="' + entity(tag.attributes[i]) + '"';
                    }

                    if (tag.isSelfClosing) {
                        res += '/>\n';
                    } else {
                        res += ('>\n');
                        parser.level++;
                    }
                };

                parser.ontext = ontext;
                parser.ondoctype = ontext;

                function ontext(text) {
                    this.indent();
                    res += (text);
                }

                parser.onclosetag = function (tag) {
                    if (!parser.tag.isSelfClosing) {
                        parser.level--;
                        this.indent();

                        res += '</' + tag + '>\n';
                    }
                };

                parser.oncdata = function (data) {
                    this.indent();
                    res += '<![CDATA[' + data + ']]>';
                };

                parser.onend = () => {
                    this.value = res;
                    resolve(res);
                };

                parser.write(xml).close();
            }
            catch (e) {
                console.error(e);
                this.value = xml;
            }
        });
    }
})