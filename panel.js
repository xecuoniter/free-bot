const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.urlencoded({ extended: true }));

const OWNER_ID = "1475102869383544884";

const files = {
  steam: "steam.txt",
  valorant: "valorant.txt",
  disney: "disney.txt",
  tivibu: "tivibu.txt",
  tvplus: "tvplus.txt"
};

function checkAuth(req) {
  return req.query.id === OWNER_ID;
}

app.get("/", (req, res) => {
  if (!checkAuth(req)) return res.send("❌ Yetkisiz");

  let html = "<h1>STOK PANELİ</h1>";

  for (let key in files) {
    let count = fs.existsSync(files[key])
      ? fs.readFileSync(files[key], "utf-8").split("\n").filter(x => x).length
      : 0;

    html += `
      <h3>${key.toUpperCase()} (${count})</h3>
      <form method="POST" action="/add/${key}?id=${OWNER_ID}">
        <input name="account" placeholder="mail:şifre"/>
        <button>EKLE</button>
      </form>
      <form method="POST" action="/clear/${key}?id=${OWNER_ID}">
        <button>SİL</button>
      </form>
      <hr>
    `;
  }

  res.send(html);
});

for (let key in files) {
  app.post(`/add/${key}`, (req, res) => {
    if (!checkAuth(req)) return res.send("❌ Yetkisiz");

    fs.appendFileSync(files[key], req.body.account + "\n");
    res.redirect("/?id=" + OWNER_ID);
  });

  app.post(`/clear/${key}`, (req, res) => {
    if (!checkAuth(req)) return res.send("❌ Yetkisiz");

    fs.writeFileSync(files[key], "");
    res.redirect("/?id=" + OWNER_ID);
  });
}

app.listen(3000, () => console.log("Panel açık"));