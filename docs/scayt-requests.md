# SCAYT requests

## Reproduce the requests

1. Add this to CKEditor config (e.g. in `config.js`):

    ```js
    config.extraPlugins = 'language,scayt';
    config.scayt_multiLanguageMode = true;
    config.language_list = ['de:German'];
    ```

2. Open page with CKEditor and open developer tools
3. Activate spell checking (ABC + checkmark icon)
4. Analyse requests to host `svc.webspellchecker.net`

## Requests

### Main JS file

`/spellcheck31/lf/scayt3/ckscayt/ckscayt.js?<timestamp in ms>`

Loads initially, static. Minified JS that has license headers from:

Module | URL | Description
------ | --- | -----------
SCAYT v3.1.8436 | <http://spellchecker.net> | which seems to handle the interaction with search suggestions
jQuip JavaScript Library v0.0.3 | <https://github.com/mythz/jquip> | "jQuery in Parts"
Rangy 1.3alpha.681 | <http://code.google.com/p/rangy/> | "Rangy, a cross-browser JavaScript range and selection library"
JS Signals 0.8.1 | <https://github.com/millermedeiros/js-signals> | "Custom Event/Messaging system for JavaScript inspired by AS3-Signals"

The first is probably the most interesting one as it seems to drive much of the interaction with CKEditor.

_To investigate:_ We might be able to load exactly this file and change the options to use our own server later on.

### Static files

#### `/spellcheck31/lf/scayt3/ckscayt/css/scayt.css`

Loads initially, static. Trivial CSS that adds underlining to misspelled words.

#### `/spellcheck31/lf/scayt3/ckscayt/local/<lang code>/local.js`

Loaded after `get_lang_list` request (see below). Static, minified JS. Contains interface translations.

### Endpoints

#### `/spellcheck31/script/ssrv.cgi`

The main API endpoint, which even has [official documentation](http://wiki.webspellchecker.net/doku.php?id=installationandconfiguration:web_service).

The plugin always sets `run_mode=web_service` and `format=json` and expects JSONP using the name given by the `callback` query parameter.

Even though the documentation doesn't mention them, the following values for `cmd` are also used by the plugin:

- `cmd=getbanner`: Seems to enable some kind of banner by returning `{banner: true}`, maybe the one that appears on the right side of the context menu for spelling corrections asking to be [licensed](https://www.webspellchecker.net/fcklicensed/).
- `cmd=get_lang_list`: Like the name suggests, it returns a list of languages supported. The schema is `{langList: {"ltr"|"rtl": {"<lang code>": "<lang name>"}}, verLang: 6}`.

## Spell Checking Request

The plugin automatically sends newly typed text to the spell checking service by calling `/spellcheck31/script/ssrv.cgi` with these query parameters:

- `cmd=check_spelling`, `run_mode=web_service`, `format=json`, `version=1.0`
- `customerid=<string>`, `callback=<ident>`
- `out_type=words`
- `slang=en_US`
- `text=<array of words>`

The responses for these queries have the following schema: `Array<{word: "<misspelled word>", ud: boolean, suggestions: string[]}>`.

### Example

Request (with query params):

```text
GET http://svc.webspellchecker.net/spellcheck31/script/ssrv.cgi

cmd: check_spelling
customerid: 1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2
run_mode: web_service
format: json
out_type: words
version: 1.0
slang: en_US
text: nearly,endless,possibilities,customiz
callback: SCAYT.prototype.IO.callback2928dc460
```

Response:

```js
/**/
SCAYT.prototype.IO.callback2928dc460([{
  "word": "customiz",
  "ud": "false",
  "suggestions": ["customize", "customized", "customizes", "custom", "customizing", "customizable", "customs", "accustom", "customization", "customizations", "accustoming", "customer", "customizability", "accustoms", "cutworm"]
}])
```
