import logo from './logo.svg';
import './App.css';
import {Map} from '../components/Map/MapboxMap';
import {Titlebar} from '../components/Titlebar/Titlebar';
import {Infobar} from '../components/Infobar/Infobar';
import {Infobars} from '../components/Infobar/Infobars';
import {Searchbar} from '../components/Searchbar/Searchbar';
import {Navbar} from '../components/Navbar/Navbar';
import {MyForm} from '../components/Form/Form';
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-grid-system'
import ReactDOM from "react-dom";
//import { Leaflet, Icon } from "leaflet";
//import 'leaflet/dist/leaflet.css';


const App = () => {

  const [origin, setOrigin] = useState([47.372406, 8.537606 ]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState([]);
  const [construct, setConstruct] = useState([]);
  const [stations, setStations] = useState([]);
  const [numcnst, setNumcnst] = useState(0);
  const [ops, setOps] = useState([]); // raw data from backend - to be removed later
  const [site, setSite] = useState("1");
  const [startDate, setStartDate] = useState(new Date());
  const [siteInfo, setSiteInfo] = useState({date_from: "2017-06-30", date_to: "2027-12-30", cap_red: "0.25", type:"none"});
  const [activeLine, setActiveLine] = useState(undefined);
  const [showpo, setShowpo] = useState(false);
  const [showstat, setShowstat] = useState(true);
  const [problems, setProblems] = useState([]);

// for now we're fetching the same data twice - the idea is to fetch markers 
// from one route and the lines from another


const fetchLines = async() => {
  try {
    const response = await fetch("/alllines");
    const data = await response.json();
    console.log("Fetching lines successful!");
    //const dataArr = data.map(el => [el.lat, el.long]);
    //console.log(dataArr);
    let dataArr = [];
    for (let lineIndex = 0; lineIndex < data.length; lineIndex++) {
      let line = {
        admin: data[lineIndex].admin,
        lnumber: data[lineIndex].lnumber,
        name: data[lineIndex].name,
        segments: []
      }
      for (let opIndex = 1; opIndex < data[lineIndex].ops.length; opIndex++) {
        let opFrom = data[lineIndex].ops[opIndex-1];
        let opTo = data[lineIndex].ops[opIndex];
        let id = line.lnumber.toString() + "_" + opIndex.toString();
        let name = line.name;
        let lnumber = line.lnumber;
        let admin = line.admin;
        //line.segments.push({name, lnumber, admin, opFrom, opTo, id});
        dataArr.push({name, lnumber, admin, opFrom, opTo, id});
      }
      //dataArr.push(line)
    }
    console.log(dataArr);
    setLines(dataArr);
    setOps(data);
    await fetchConstruction(data, dataArr);
    await fetchProblems(data, dataArr);
  } catch (err) {
    console.log("There was a problem with backend connection");
    return;
  }
}

  const fetchMarkers = async() => {
    try {
      const response = await fetch("/allops");
      const data = await response.json();
      console.log("Fetching markers successful!");
      console.log(data);
      setMarkers(data);
    } catch (err) {
      console.log("There was a problem with backend connection");
      return;
    }
  }

  const fecthStations = async() => {

  try {
    var address = 'https://data.sbb.ch/api/records/1.0/search/?dataset=passagierfrequenz&q=&rows=906&sort=bahnhof_haltestelle&facet=code&facet=bezugsjahr&facet=eigner&facet=dtv&facet=dwv&facet=dnwv'
    const response = await fetch( address );
    const data = await response.json();
    console.log("FETCHING API SUCCESSFUL");

   /*
   DTV = Durchschnittlicher täglicher Verkehr (Montag bis Sonntag) im 2018.
   DWV = Durchschnittlicher werktäglicher Verkehr (Montag bis Freitag) im 2018.
   DNWV = Durchschnittlicher nicht-werktäglicher Verkehr (Samstage, Sonntage, Feiertage) im 2018.
    */

    setStations(data.records);
  } catch (err) {
    console.log("There was a problem with API connection");
    return;
  }

  }

    const findPathsContainingEndpoints = (data, points, lines) => {
      // construction sites to lines
      for (let consIdx = 0; consIdx < data.length; consIdx++) {
        let operatingLines = [];
        let operatingPoints = [];
        let opFirst = data[consIdx].ops[0]; // starting point of constr site
        let opSecond = data[consIdx].ops[1]; // ending point of constr site
        // opLines: lines which are on either of the endpoints
        let opLines = points.filter((l) => {return l.ops.some((op) => {return op.abbreviation === opFirst.abbreviation || op.abbreviation === opSecond.abbreviation})});
        let abbrs = opLines.map((l) => {return l.ops.map(op => op.abbreviation)});
        for (let lineIndex = 0; lineIndex < opLines.length; lineIndex++) {
          let firstIndex = abbrs[lineIndex].indexOf(opFirst.abbreviation);
          let secondIndex = abbrs[lineIndex].indexOf(opSecond.abbreviation);
          // make sure that both endpoints are on the same line
          if ( firstIndex !== -1 &&  secondIndex !== -1) {
            let indices = (firstIndex < secondIndex) ? [firstIndex, secondIndex] : [secondIndex, firstIndex];
            let lineInfo = {
              name: opLines[lineIndex].name,
              lnumber: opLines[lineIndex].lnumber,
            }
            // lines need to be displayed differently than points
            if (indices[0] === indices[1]) {
              lineInfo.point = opLines[lineIndex].ops[indices[0]];
              operatingPoints.push(lineInfo);
            } else {
              lineInfo.segment = lines.filter((l) => l.lnumber == lineInfo.lnumber).slice(indices[0], indices[1]);
              operatingLines.push(lineInfo);
            }
          }
        }
        data[consIdx].operatingLines = operatingLines;
        data[consIdx].operatingPoints = operatingPoints;
      }
    }

  const fetchProblems = async(points, lines) => {
    try {
      const response = await fetch("/allproblems");
      const data = await response.json();
      console.log("Fetching problems successful!");
      console.log(data);
      // this doesnt help unfortunately
      //findPathsContainingEndpoints(data, points, lines);
      setProblems(data);
    } catch (err) {
      console.log("There was a problem with backend connection");
      return;
    }
  }

  const fetchConstruction = async(points, lines) => {
    try {
      const response = await fetch("/allconstrs");
      const data = await response.json();
      console.log("Fetching construction sites successful!");
      console.log(data);
      findPathsContainingEndpoints(data, points, lines);
      setConstruct(data);
    } catch (err) {
      console.log("There was a problem with backend connection");
      return;
    }
  };

  const fetchData = async() => {
    setLoading(true);
    await fetchMarkers();
    await fetchLines();
    await fecthStations();
    setLoading(false)

  }
  
  

  return ( 
    <div>
      {loading ? <div>Loading</div> : 
    
    <div>
    <Titlebar text={"Intelligent\nrestriction detection"}/> 
    <Container>
    <Row>
      
       {/*<Col className="left-container"
        xs={2}
        style={{backgroundColor:'#2F4989'}}>
      </Col>*/}

        <Col className="map-container" xs={7.8} style={{backgroundColor:"#e62b19"}}>
        <Searchbar fetchMarkers={fetchData} startDate={startDate} setStartDate={setStartDate} numcnst={numcnst} showpo={showpo} setShowpo={setShowpo} showstat={showstat} setShowstat={setShowstat} style={{color: "black"}}/>
        <Map markers={markers} lines={lines} origin={origin} setSite={setSite}  setSiteInfo={setSiteInfo} setActiveLine={setActiveLine} activeLine={activeLine} construct={construct} problems={problems} startDate={startDate} setNumcnst={setNumcnst} showpo={showpo}
        stations={stations} showstat={showstat} style={{width: "100%"}}/>
        </Col>

        <Col xs={3.2} style={{backgroundColor:'#2F4989'}}>
          
          <div className="info-container">
          <h2><font color="white"><b>Current construction sites</b></font></h2>
              
             
              <Infobars construct={construct} startDate={startDate}/>
              {/*<Infobar num={3, "18rem"}/>
              <Infobar site_info={siteInfo}  />
              <Infobar num={4, "18rem"}/>
              <Infobar num={5, "18rem"}/>
              <Infobar num={6, "18rem"}/>*/}
          </div>
        </Col>
      </Row>
      
      </Container>

    </div>
    }
    </div>
   );
}
 
export default App;
