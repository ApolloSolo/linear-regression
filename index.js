const { read_csv } = require("../lin_regress/reading");
const Five_Var_Stats = require("./math/class/Five_Var_Stats");

async function on_boot() {
  const { data } = await read_csv("./sales_temp.csv");
  const dataset = new Five_Var_Stats(data, 3);
  console.log(dataset);
}

on_boot();
