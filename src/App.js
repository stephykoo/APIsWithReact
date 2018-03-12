import React, { Component } from 'react';
import {
  Jumbotron,
  Table,
  Image,
  Grid,
  Row,
  Col } from 'react-bootstrap';
import neoData from './sample-neo';
import issData from './sample-iss';
import neoMapData from './sample-neo-map';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    let today = new Date()
    this.state = {
      rawData: neoData,
      issLocation:issData,
      neoMapData: neoMapData,
      reference_id: neoMapData.neo_reference_id,
      name: neoMapData.name,
      diameter_in_feet_min: neoMapData.estimated_diameter.feet.estimated_diameter_min,
      diameter_in_feet_max: neoMapData.estimated_diameter.feet.estimated_diameter_max,
      close_approach_data: neoMapData.close_approach_data,
      asteroids: [],
      apiKey: "6XxmggxHKk3ERXFEpT8WrKCoWyZMeza6kOthbsQ6",
      startDate:`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`,
      apiUrl: "https://api.nasa.gov/neo/rest/v1/feed"
    }
  }

  componentWillMount(){
    fetch(`${this.state.apiUrl}?start_date=${this.state.startDate}&api_key=${this.state.apiKey}`).then((rawResponse)=>{
      // rawResponse.json() returns a promise that we pass along
      return rawResponse.json()
    }).then((parsedResponse) => {

      // when this promise resolves, we can work with our data
      let neoData = parsedResponse.near_earth_objects
      console.log(neoData);
      let newAsteroids = []
      Object.keys(neoData).forEach((date)=>{
        neoData[date].forEach((asteroid) =>{
          newAsteroids.push({
            id: asteroid.neo_reference_id,
            name: asteroid.name,
            date: asteroid.close_approach_data[0].close_approach_date,
            diameterMin: asteroid.estimated_diameter.feet.estimated_diameter_min.toFixed(0),
            diameterMax: asteroid.estimated_diameter.feet.estimated_diameter_max.toFixed(0),
            closestApproach: asteroid.close_approach_data[0].miss_distance.miles,
            velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.miles_per_hour).toFixed(0),
            distance: asteroid.close_approach_data[0].miss_distance.miles
          })
        })
      })

      // state is updated when promises are resolved
      this.setState({asteroids: newAsteroids})
    })
  }


  render() {
    return (
      <div>
        <Jumbotron>
          <h1>Hello, world!</h1>
          <p>
            This is a simple hero unit, a simple jumbotron-style component for calling
            extra attention to featured content or information.
          </p>
          <Grid>
            <Row>
              <Col xs={6} md={4}>
                <Image width={300} height={300} src="http://magazine.viterbi.usc.edu/wp-content/uploads/BSP_054.jpg" thumbnail />
              </Col>
              <Col xs={6} md={4}>
                <Image width={300} height={300}  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6iNAbv_IzOT0gYE_E2A-I_5m9xfqS1SxJLF4sNBlVmtK2z52xXA" thumbnail />
              </Col>
              <Col xs={6} md={4}>
                <Image width={300} height={300} src="https://static.pexels.com/photos/2154/sky-lights-space-dark.jpg" thumbnail />
              </Col>
            </Row>
          </Grid>
        </Jumbotron>

        <div>
          <h4>Coordinates: </h4>
          {this.state.issLocation.iss_position.latitude + ", " + this.state.issLocation.iss_position.longitude}
        </div>

        <div>
          <Table bordered condensed striped hover>
            <thead>
              <tr>
                <th>Approach Date</th>
                <th>Relative Velocity (km/s)</th>
                <th>Relative Velocity (km/h)</th>
                <th>Relative Velocity (mph)</th>
                <th>Orbiting Body</th>
              </tr>
            </thead>
            <tbody>
              { this.state.close_approach_data.map ((el, idx) => {
                return (
                  <tr key={ idx }>
                    <td>{ el.close_approach_date }</td>
                    <td>{ el.relative_velocity.kilometers_per_second }</td>
                    <td>{ el.relative_velocity.kilometers_per_hour }</td>
                    <td>{ el.relative_velocity.miles_per_hour }</td>
                    <td>{ el.orbiting_body }</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>

        <div>
          <Table bordered condensed striped hover>
            <thead>
              <tr>
                <th>Asteroids_Id</th>
                <th>Asteroids_Name</th>
                <th>Asteroids_Date</th>
                <th>Asteroids_Velocity</th>
                <th>Asteroids_Distance</th>
              </tr>
            </thead>
            <tbody>
              { this.state.asteroids.map ((el, idx) => {
                return (
                  <tr key={ idx }>
                    <td>{ el.id }</td>
                    <td>{ el.name }</td>
                    <td>{ el.date }</td>
                    <td>{ el.velocity }</td>
                    <td>{ el.distance }</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>



      </div>
    );
  }
}

export default App;
