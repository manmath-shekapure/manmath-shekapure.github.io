function simpleInterest() {
  let p = document.getElementById("p").value;
  let r = document.getElementById("r").value;
  let t = document.getElementById("t").value;

  let si = (p * r * t) / 100;
  document.getElementById("siResult").innerHTML = "Simple Interest: ₹" + si;
}

function emiCalc() {
  let loan = document.getElementById("loan").value;
  let rate = document.getElementById("rate").value / 12 / 100;
  let months = document.getElementById("months").value;

  let emi = (loan * rate * Math.pow(1 + rate, months)) /
            (Math.pow(1 + rate, months) - 1);

  document.getElementById("emiResult").innerHTML = "EMI: ₹" + emi.toFixed(2);
}