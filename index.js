const express = require("express");
// importing object that has the country data
const zones = require("./countries");

const app = express();
const port = 3000;

// this section is responsible for extracting the countery data
const eba = Object.keys(zones);
const zobo = eba.map((country) => {
  return {
    "county code": country,
    "country name": zones[country].name,
    timezone: zones[country].timezone,
  };
});


// route for displaying available countries and timezones
app.get("/", async (req, res) => {
  res.send(zobo);
});

// route for scheduling meetings
app.get("/setmeeting", async (req, res) => {
  let x = JSON.parse(req.query.input); // used for handling the inputed data
  let dateFrom = ""; //used for handling start dates
  let dateTo = "";// used for handling end dates
  let fromArray = [];// stores all the start dates
  let toArray = [];// stores all the end dates
  const p = new Date(); // current time
  let zonebuster1 = "";// for timezone comparisons
  let zonebuster2 = "";
  for (let element of x) {
    let i = element["CC"].toUpperCase();//to allow users be able to input country codes in any case they prefer


    //checks if the country code exits
    if (eba.includes(i) == false) {
      res
        .status(404)
        .send("you have entered a country code that is not available");
      return false;
    }
    

    dateFrom = element["from"];

    dateTo = element["to"];

    try {

        //timezone logic
      zonebuster1 = dateFrom.slice(21);
      zonebuster2 = dateTo.slice(21);

      if (zonebuster1[0] && zonebuster2[0] == " ") {
        zonebuster1 = "UTC+" + zonebuster1.slice(1);//logic to resolve req.query encoding issues
        zonebuster2 = "UTC+" + zonebuster2.slice(1);
      }
      if (zonebuster1[0] && zonebuster2[0] == "-") {
        zonebuster1 = "UTC" + zonebuster1;
        zonebuster2 = "UTC" + zonebuster2;
      }

      if (zonebuster1 !== zonebuster2) {
        res.status(409).send("your timezones do not match");
        return false;
      }

      if (zones[i]["timezone"].includes(zonebuster1) == false) {
        console.log(zones[i]["timezone"]);
        //
        res
          .status(409)
          .send("please enter the correct timezone for the country");
        return false;
      }

      if (dateFrom[21] === " " && dateTo[21] === " ") {
        const sour = dateFrom.split(" ");// extracting the date from the time string
        const sweet = dateTo.split(" ");

        const timeFrom = new Date(sour[0] + "+" + sour[1]);// adding back the + sign 
        const timeTo = new Date(sweet[0] + "+" + sweet[1]);


        //logic for preventing scheduling meetings in the past and having stop time before start time

        if (timeFrom.getTime() <= p.getTime()) {
          res
            .status(409)
            .send(
              "your from date has to be after the current time for you to schedule a meeting"
            );
          return false;
        }
        if (timeFrom.getTime() >= timeTo.getTime()) {
          res
            .status(409)
            .send("your from date has to be before the TO(conclusion) date");
          return false;
        }


        //logic to handle holidays

        let holiday = dateFrom.split("T");

        if (zones[i][holiday[0]]) {
          res
            .status(409)
            .send(
              `no meeting can occur there is a holiday on this date ${
                zones[i][holiday[0]]
              }`
            );
          return false;
        }
        fromArray.push(timeFrom);
        toArray.push(timeTo);
      }
      if (dateFrom[21] === "-" && dateTo[21] === "-") {
        const timeFromi = new Date(dateFrom);
        const timeToi = new Date(dateTo);

        if (timeFromi.getTime() <= p.getTime()) {
          res
            .status(409)
            .send(
              "your from date has to be after the current time for you to schedule a meeting"
            );
          return false;
        }
        if (timeFromi.getTime() >= timeToi.getTime()) {
          res
            .status(409)
            .send("your from date has to be before the TO(conclusion) date");
          return false;
        }
        fromArray.push(timeFromi);
        toArray.push(timeToi);
      }
    } catch (error) {
      console.log(error);
    }
  }


  //sorting out the avilable time slots
  const dateString = fromArray.filter((element) => {
    return element.toDateString() == fromArray[0].toDateString();
  });
  
  const weekend = fromArray.filter((element) => {
    if (element.getDay()===6 || element.getDay()===0) {
        return element
    }
  });

  if(weekend.length>0){
    res.status(409).send("meetings can not be held on weekends");
    return false;
  }
  
  if (dateString.length !== fromArray.length) {
    res.status(409).send("the dates need to be on the same day");
    return false;
  }

  const max = Math.max(...fromArray);
  const min = Math.min(...toArray);

  res
    .status(200)
    .send(
      `a meeting can hold at ${new Date(max).toISOString()} to ${new Date(
        min
      ).toISOString()}`
    );
});

app.listen(port, () => {
  console.log("we are live");
});

module.exports = app;