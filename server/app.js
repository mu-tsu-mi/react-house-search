import express from "express";
const app = express();
const port = process.env.PORT || 3001;
import domainCtrl from "../controllers/domain.js";

app.get("/api/house", domainCtrl.getHouses);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
