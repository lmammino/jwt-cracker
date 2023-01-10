const crypto = require("crypto");

const generateSignature = function (content, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(content)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};
process.on("message", function ({ chunk, content, signature }) {
  console.log("process spawned", chunk.length);
  for (let i = 0; i < chunk.length; i++) {
    const currentSignature = generateSignature(content, chunk[i]);
    if (currentSignature == signature) {
      process.send(chunk[i]);
      process.exit(0);
    }
  }
    process.send(null);
  process.exit(1);
});
