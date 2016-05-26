const test = require("ava").test;
const request = require("supertest-as-promised");
const express = require("express");

const app = express();
app.use(require("./server"));

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
          'sma_NO': 'South Sámi',
          'sme_NO': 'Northern Sámi',
          'smj_NO': 'Lule Sámi',
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
    .query({ slang: "sma_NO", text: "akkusatijvh" })
    .expect(200)
    .expect([])
);

test("Check Spelling: Suggestions", () =>
  request(app)
    .get(API)
    .query(spellCmd())
    .query({ slang: "sma_NO", text: "akkusativa" })
    .expect(200)
    .expect([
      {
        word: 'akkusativa',
        suggestions: ['akkusatijvh', 'akkusatijvi', 'akkusativ-D', 'akkusativ-V', 'akkusativ-M', 'akkusativ-L', 'akkusativ-I', 'akkusativ-C'],
        ud: false,
      },
    ])
);

test("Check Spelling: Empty Suggestions", () =>
  request(app)
    .get(API)
    .query(spellCmd())
    .query({ slang: "sma_NO", text: "apfelkuchen" })
    .expect(200)
    .expect([
      {
        word: 'apfelkuchen',
        suggestions: [],
        ud: false,
      },
    ])
);

