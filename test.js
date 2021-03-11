const test = require("ava").test;
const request = require("supertest-as-promised");
const express = require("express");

const app = express();
app.use(require("./server/index"));

const API = "/spellcheck/script/ssrv.cgi";

const cmd = (name) =>
  ({ 'cmd': name, 'run_mode': "web_service", 'format': "json" });

const spellCmd = () => ({
  'cmd': "check_spelling",
  'run_mode': "web_service",
  'format': "json",
  'version': "1.0",
  'out_type': "words",
});

test("Get Banner", () =>
  request(app)
    .get(API)
    .query(cmd("getbanner"))
    .expect(200)
    .expect({ banner: false })
);

test("Get Lang List", () =>
  request(app)
    .get(API)
    .query(cmd("get_lang_list"))
    .expect(200)
    .expect({
      langList: {
        ltr: {
          sma: 'Giellatekno/Divvun/UiT fst-based speller for Southern Sami',
        },
        rtl: {},
      },
      verLang: 6,
    })
);

test("Check Spelling: Correct Word", () =>
  request(app)
    .get(API)
    .query(spellCmd())
    .query({ slang: "sma", text: "akkusatijvh" })
    .expect(200)
    .expect([])
);

test("Check Spelling: Suggestions", (t) =>
  request(app)
    .get(API)
    .query(spellCmd())
    .query({ slang: "sma", text: "akkusativa" })
    .expect(200)
    .then((res) => {
      t.truthy(Array.isArray(res.body));
      const s = res.body[0];

      t.deepEqual(s.word, 'akkusativa');
      t.deepEqual(s.ud, false);

      // Only check the values are all present but ignore the order. (For some
      // reason, the order of suggestions is different on Linux and OS X...)
      t.deepEqual(s.suggestions.sort(), ['akkusatijve', 'akkusatijvh', 'akkusatijvi', 'akkusativ-C', 'akkusativ-D', 'akkusativ-I', 'akkusativ-L', 'akkusativ-M', 'akkusativ-V', 'akkusativ-X'].sort());
    })
);


test("Check Spelling: Empty Suggestions", () =>
  request(app)
    .get(API)
    .query(spellCmd())
    .query({ slang: "sma", text: "apfelkuchen" })
    .expect(200)
    .expect([
      {
        word: 'apfelkuchen',
        suggestions: [],
        ud: false,
      },
    ])
);

test("Check Spelling: Suggestions for multiple words", (t) =>
  request(app)
    .get(API)
    .query(spellCmd())
    .query({ slang: "sma", text: "lorem,ipsum" })
    .expect(200)
    .then((res) => {
      t.truthy(Array.isArray(res.body));

      // Check lorem
      const s0 = res.body[0];
      t.deepEqual(s0.word, 'lorem');
      t.deepEqual(s0.ud, false);
      t.deepEqual(s0.suggestions.sort(), ['Borem', 'Doram', 'Floram', 'Florem', 'Morem', 'Norem', 'Torem', 'lorvem', 'lovrem', 'låvrem'].sort());

      // Check ipsum
      const s1 = res.body[1];
      t.deepEqual(s1.word, 'ipsum');
      t.deepEqual(s1.ud, false);
      t.deepEqual(s1.suggestions.sort(), ['Aksum', 'Epsom', 'Hasum', 'Husum', 'Pesum', 'Sippum', 'Sisum', 'gipsem', 'gipsim', 'jipsem'].sort());
    })
);
