import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      title: "Country App",
      countries: []
    }
  }

  componentDidMount() {
    console.log('Component has mounted');
    var countriesObj = this;
    fetch('http://localhost:3000/api/countries')
      .then(function(response) {
        response.json()
          .then(function(data) { 
            console.log(data) 
              countriesObj.setState({
                countries: data
              })
          });
      });
  }

  removeCountry(country_name){
    var countryObj = this;
    let countries = this.state.countries;
    let country = countries.find(function (country) {
      return country.country_name = country_name
    });

    console.log(country_name);

    var request = new Request('http://localhost:3000/api/remove/' + country_name, {
      method: 'DELETE'
    });

    fetch(request)
      .then(function(response) {
        countries.splice(countries.indexOf(country), 1);
        countryObj.setState({
          countries: countries
      })
      response.json()
        .then(function (data) {
          console.log(data)
        })
      })
  }

  addCountry(event) {
    var countryObj = this;
    event.preventDefault();
    let countr_data = {
      country_name: this.refs.country_name.value,
      continent_name: this.refs.continent_name.value
    };

    var request = new Request('http://localhost:3000/api/new-country', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(countr_data)
    });

    let countries = countryObj.state.countries;
    countries.push(countr_data);
    console.log(countries);
    console.log(countr_data);
    countryObj.setState({
    countries: countries   
    })
    fetch(request)
      .then(function(response) {
        response.json()
          .then(function(data) {
            })
          })
      .catch(function(err){
        console.error();
        console.log(err);
      })
  }
  render() {
    let title = this.state.title;
    let countries = this.state.countries;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          
        </div>

        <div>
          <h3>{title}</h3>

          <hr/>

          <form>
            <input type="text" ref="country_name" placeholder="country name" />
            <input type="text" ref="continent_name" placeholder="continent name" />
            <button onClick={this.addCountry.bind(this)}>Add Country</button>
          </form>
          <ul>
            {countries.map(country => <li key={country.country_id}>{country.country_name}<button onClick={this.removeCountry.bind(this, country.country_name)}>Remove</button></li>)}
          </ul>
          <br/>
        </div>
      </div>
    );
  }
}

export default App;
