import React, { useState, useEffect } from 'react'

interface ComponentProps {
  timestamp : any
}

function FormatTimestamp({ timestamp }: ComponentProps ) {
    const [formattedTime , setFormattedTime] = useState("")

    useEffect(() => {
      formatTimestamp();
    }, [])

    const formatTimestamp = () => {
      const splitDateAndTime = timestamp.split("T")
      const date = splitDateAndTime[0].split("-");
      const time =  splitDateAndTime[1].split(":");
      const hourAndMin = time[0] + ":" + time[1];
      var month;
      switch(date[1]){
        case "01" : month = "January"; break;
        case "02" : month = "Febraury"; break;
        case "03" : month = "March"; break;
        case "04" : month = "April"; break;
        case "05" : month = "May"; break;
        case "06" : month = "June"; break;
        case "07" : month = "July"; break;
        case "08" : month = "August"; break;
        case "09" : month = "September"; break;
        case "10" : month = "October"; break;
        case "11" : month = "November"; break;
        case "12" : month = "December"; break;  
      };
      const year = date[0].split("")
      const yearAbbr = year[2] + year[3];
      const fullDate = date[2] +  " " + month + " " + yearAbbr;
      const displayTimestamp = fullDate + " at " + hourAndMin;
      setFormattedTime(displayTimestamp);
    }

     return (
      <p className="post-date">{formattedTime}</p>
     )
}

export default FormatTimestamp;