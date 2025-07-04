const axios = require("axios");

module.exports = {
  getHouses,
};

const api = axios.create({ timeout: 5000 });

async function getHouses(req, res) {
  const url = req.query.url;
  try {
    const response = await api.get(url);
    const data = await response.data;
    console.log("data: ", data);
    await res.send(data);
  } catch (error) {
    console.error("Error: ", error);
  }
}
