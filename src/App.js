import React, { Component } from "react";
import "./App.css";
import { RingLoader } from "react-spinners";
import { geolocated } from "react-geolocated";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

import card from "./assets/card.jpg";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: {},
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    if (this.props.isGeolocationAvailable) {
      if (this.props.isGeolocationEnabled) {
        console.log(this.props.coords);
      } else {
        this.setState({ error: "Location is turned off", isLoading: false });
      }
    } else {
      this.setState({
        error: "Your device does not supprt location",
        isLoading: false
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.coords !== null) {
      const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?lat=";

      fetch(
        `${BASE_URL}${newProps.coords.latitude}&lon=${
          newProps.coords.longitude
        }&appid=${process.env.REACT_APP_APPID}`,
        { method: "GET" }
      ) //get the url
        .then(response => { 
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Something went wrong ...");
          }
        })
        .then(json => {
          let items = json;
          this.setState(prevState => ({
            city: items,
            isLoading: false
          }));
        })
        .catch(error => this.setState({ error, isLoading: false }));
    }
  }

  convertTemp = kel => {
    let cel = kel - 273.15;
    return cel.toFixed(2);
  };

  showTime = unix => {
    let date = new Date(unix * 1000);
    let hour = date.getHours();
    let min = date.getMinutes();
    if (hour < 12) {
      return `${hour} : ${min < 10 ? `0${min}` : min}  AM`;
    } else {
      return `${hour % 12} : ${min} PM`;
    }
  };

  render() {
    const { isLoading, error, city } = this.state;
    if (isLoading) {
      return (
        <div className="app">
          <div className="forecast-loader">
            <RingLoader
              sizeUnit={"px"}
              size={250}
              color={"#123abc"}
              loading={this.state.loading}
            />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="app">
          <div className="forecast-loader">
            <p>{error.message}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="app">
        <div className="forecast">
          <Card className="text-black">
            <Card.Img src={card} alt="wather" />
            <Card.ImgOverlay>
              <Card.Title style={{ fontSize: "32px" }}>{city.name}</Card.Title>
              <Card.Subtitle>{this.showTime(city.dt)} </Card.Subtitle>
            </Card.ImgOverlay>
          </Card>

          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Temperature
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <div>
                    Temperature: {this.convertTemp(city.main.temp)}&deg;C
                  </div>
                  <div>
                    Minimum Temperature: {this.convertTemp(city.main.temp_min)}
                    &deg;C
                  </div>
                  <div>
                    Maximum Temperature: {this.convertTemp(city.main.temp_max)}
                    &deg;C
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1">
                Pressure
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  {city.main.pressure ? (
                    <div>Atmospheric Pressure: {city.main.pressure}hPa</div>
                  ) : (
                    <div>
                      <div>
                        Atmospheric Pressure, Sea Level: {city.main.sea_level}
                        hPa
                      </div>
                      :
                      <div>
                        Atmospheric Pressure, Ground Level:{" "}
                        {city.main.grnd_level}hpa
                      </div>
                      :
                    </div>
                  )}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="2">
                Wind
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  <div>Wind Speed: {city.wind.speed}m/s</div>
                  <div>
                    Wind Direction: {city.wind.deg.toFixed(2)}
                    &deg;
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="4">
                Weather
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="4">
                <Card.Body>
                  <img src={`http://openweathermap.org/img/w/${city.weather[0].icon}.png`} alt='icon'/>
                  <div>Summary: {city.weather[0].main}</div>
                  <div>Desc: {city.weather[0].description}</div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 100000
})(App);
