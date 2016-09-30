# CKEditor SCAYT Extension for hfst-ospell

This project contains a server based on Node.js that enables you to use the spellcheck-as-you-type extions for CKEditor with [hfst-ospell](https://github.com/hfst/hfst-ospell) dictionaries.

[![Build Status](https://travis-ci.org/killercup/ck-ospell.svg?branch=master)](https://travis-ci.org/killercup/ck-ospell)

## Install

Since this is based on
[hfst-ospell-js](https://github.com/divvun/hfst-ospell-js), you need to have
a C++ compiler, python, and `libarchive` installed on your system (see
[this Readme](https://github.com/divvun/hfst-ospell-js/blob/master/Readme.md)
for more information), as well as use NPM version 3 (or higher). Then, it's just

```sh
$ npm install
```

For instructions on how to install the CKEditor plugin, please see the `Readme.md` file in `client/ckeditor/plugins/giella/`.

## Running Example

To get see an example, just run

```sh
$ npm start
```

and open <http://localhost:3000/> in your browser.

Assuming you have some dictionaries installed (see below), you can test the functionality like this:

1. Type "Lorem ipsum" into CK Editor
2. Click "ABC" icon, activate SCAYT
3. (In the same menu) change language to Northern Sámi
4. See spelling suggestions
5. Successfully correct "Lorem ipsum" to "bore Epsom"!

## Dictionaries

By conventions, all dictionary files need to be

- placed in the local `etc/` directory,
- called `LANG_COUNTRY.zhfst`,
- and, of couse, be valid (compressed) HFST files.

You can find several dictionaries on [divvun.no](http://www.divvun.no/korrektur/otherapps.html). Many are under the GPL, for some there is no license specified, though.

Assuming you accept the respective licensing terms, you can e.g. use

```sh
$ curl http://divvun.no/static_files/zhfsts/se.zhfst > "etc/sme_NO.zhfst"
$ curl http://divvun.no/static_files/zhfsts/smj.zhfst > "etc/smj_NO.zhfst"
$ curl http://divvun.no/static_files/zhfsts/sma.zhfst > "etc/sma_NO.zhfst"
```

to download the files for Northern, South, and Lule Sámi.
