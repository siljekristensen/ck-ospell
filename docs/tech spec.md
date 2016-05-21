# Proposal

Implement a web API for using hfst-ospell library for doing spellcheck,
with a simple HTML frontend and a JSON API.

# Deliverables

- A nodejs (JavaScript) HTTP backend, with HTML and JSON output
- Localisation support for HTML output (static strings, dropdowns,
language names, etc)
- A nodejs binding to the libhfstospell dynamic library
- Documentation

Node is a suitable technology choice for this project as it has high
throughput and easy scalability, and is great for very quick deployment.

# Example use case

Note: these are not necessarily going to be implemented as specified,
but exist to give you an idea of the intention.

## Web frontend

- User goes to http://samispeller.tld
- User is presented with a tool that shows all the supported languages
and a text field
- User selects Northern Sámi from the dropdown, and enters a Northern
Sámi sentence and hits submit.
- The user is presented with the text with red underlines under those
words that are incorrect, with suggested displayed upon highlighting

## JSON API

- An application makes a JSON request to
http://samispeller.tld/{iso_language_code} with their string to be spell
checked
- A reply is received with a key-value object of the words detected as
incorrect, with an array of weighted suggestions

# Scope

- Compatibility with all hfst-ospell compatible input
- Handling of capitalisation issues
- A simple HTML frontend for each language when accessed in a browser
- JSON API for using with applications and webapps

# Out of scope/potential future extensions

- Actual configuration of service on a server (though documentation on
how to run and maintain will be provided, and support offered)
- Rate limiting
- API keys for users (eg paid usage for large amounts of spellchecking,
such as NRK)