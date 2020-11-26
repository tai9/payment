import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import axios from "axios";

const Invoice = () => {
  const [data, setData] = useState({});
  const [codeValue, setCodeValue] = useState("");
  const [time, setTime] = useState({});
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    let PaymentCurrencyNetwork;
    let addr;
    axios
      .get(
        "http://localhost:8080/api/invoice/a626fb52-de85-4fe1-a30f-93d161380e02"
      )
      .then((res) => {
        if (res.data.Invoice.PaymentCurrencyNetwork === "ETH") {
          PaymentCurrencyNetwork = "ethereum";
        }
        addr =
          PaymentCurrencyNetwork +
          ":" +
          res.data.Invoice.PaymentAddress +
          "?amount=" +
          res.data.Invoice.RequestedDepositAmount;

        let expired = Date.parse(res.data.Invoice.ExpiredAt) - Date.now();
        setCodeValue(addr);
        // setSeconds(expired);
        // setTime(secondsToTime(expired));
        console.log(Date.parse(res.data.Invoice.ExpiredAt) - Date.now());
        setData(res.data.Invoice);

        // ---------------------
        // const timer = setInterval(() => {
        //   setSeconds((s) => s - 1);
        //   // countDown();
        // }, 1000);

        // return () => clearInterval(timer);
      });
  }, []);

  useEffect(() => {
    // countDown();
    console.log(seconds);
  }, [seconds]);

  const countDown = () => {
    console.log(seconds);
    const secondValues = seconds - 1;

    setTime(secondsToTime(secondValues));
    setSeconds(secondValues);
    if (secondValues === 0) {
      console.log("expired");
      //   clearInterval(timer);
    }
  };

  const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    console.log(obj);
    return obj;
  };

  //   useEffect(() => {

  //   }, []);
  return (
    <div>
      {/* <p>Expired at: {seconds > 0 ? `${time.m}:${time.s}` : "Expired!"}</p> */}
      <p>Expired at:{data.ExpiredAt} </p>
      <QRCode value={codeValue} size={200} />
      <p>{data.PaymentAddress}</p>
      <div>
        <span>Ammount: {data.RequestedDepositAmount}</span>
        <span> {data.PaymentCurrency}</span>
      </div>
    </div>
  );
};

export default Invoice;
