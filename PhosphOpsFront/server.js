const { exec } = require("child_process");
const port = process.env.PORT || 8080;
exec(`npx serve -s . -l ${port}`, (err, stdout, stderr) => {
  if (err) console.error(err);
  console.log(stdout);
});