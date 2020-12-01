import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import axios from "axios";
import { useParams } from "react-router-dom";
const URL_API = "http://localhost:8080/api/invoice";

const Invoice = () => {
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState({});
  const [data, setData] = useState({});
  const [codeValue, setCodeValue] = useState("");

  let { id } = useParams();

  useEffect(() => {
    getInvoiceById(id);
    // a626fb52-de85-4fe1-a30f-93d161380e02
  }, [id]);

  // CountDown Timer
  useEffect(() => {
    setTimer(secondsToTime(seconds));
    let interval = null;
    interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  // Get Invoice By Id Api
  const getInvoiceById = async (id) => {
    let PaymentCurrencyNetwork = "";
    let addr = "";
    let expired = 0;

    const paramURL = URL_API + "/" + id;

    await axios.get(paramURL).then((res) => {
      if (res.data.Invoice.PaymentCurrencyNetwork === "ETH") {
        PaymentCurrencyNetwork = "ethereum";
      }
      addr =
        PaymentCurrencyNetwork +
        ":" +
        res.data.Invoice.PaymentAddress +
        "?amount=" +
        res.data.Invoice.RequestedDepositAmount;

      expired = Date.parse(res.data.Invoice.ExpiredAt) - Date.now();
      if (expired <= 0) {
        setSeconds(0);
      } else {
        setSeconds(expired / 1000);
      }
      setCodeValue(addr);
      setData(res.data.Invoice);
    });
  };

  // convert seconds to time util
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
    return obj;
  };

  // Check expiration
  const isExpired = (timer) =>
    timer && timer.h <= 0 && timer.m <= 0 && timer.s <= 0;

  return (
    <div>
      <div style={{ margin: 20 }}>
        <span>Expired at: </span>
        <span>
          {!isExpired(timer)
            ? timer.h + ":" + timer.m + ":" + timer.s
            : "Expired!"}
        </span>
      </div>
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
