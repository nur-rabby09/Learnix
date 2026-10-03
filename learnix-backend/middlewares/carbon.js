import { co2 } from "@tgwf/co2";

const co2Emission = new co2({ model: "swd" });

let totalBytes = 0;

const carbon = (req, res, next) => {
  // Lets the browser see the real size of API responses (frontend runs on a different port)
  res.set("Timing-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");

  res.on("finish", () => {
    const requestBytes = Number(req.headers["content-length"]) || 0;
    const responseBytes = Number(res.getHeader("content-length")) || 0;
    const bytes = requestBytes + responseBytes;

    totalBytes += bytes;

    const grams = co2Emission.perByte(bytes, false);
    const totalGrams = co2Emission.perByte(totalBytes, false);

    console.log(
      `Carbon: ${req.method} ${req.originalUrl} - ${bytes} bytes, ${grams.toFixed(6)} g CO2 | Total: ${totalBytes} bytes, ${totalGrams.toFixed(6)} g CO2`,
    );
  });

  next();
};

export default carbon;