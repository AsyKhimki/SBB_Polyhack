import React, { Component } from "react";
import {Infobar} from './Infobar';


export const Infobars = ({ construct, startDate } ) => {


  return (
    <div>
    {construct.filter( obj => {
        var date_from = new Date(obj.date_from);
        var date_to = new Date(obj.date_to);
        var ans = date_from.getTime() <= startDate.getTime() && date_to.getTime() >= startDate.getTime()
        return ans
    }).map( obj => {
      console.log({obj});
      return <Infobar site_info={obj}/>
    })}
    </div>
  );
};

