import React, { Component } from 'react';
import './App.css';

import data from './data.js';

class App extends Component {
  state = {
    routes: data.routes,
    airline_code: null,
    airport_code: null,
    airline_list: [],
    airport_list: [],
  }

  reset = (event) => {
    console.log(this);
//    this.setState({
//      airline_code: null,
//      airport_code: null,
//    });
//    this.updateTableForAirline(event);
//    this.updateTableForAirport(event);
  };

  updateTableForAirline = (event) => {
    let selected_airline = event.target.value;
    let selected_airline_code;
    let filtered_routes;

    if (selected_airline === 'All') {
      selected_airline_code = null;
      if (this.state.airport_code === null) {
        filtered_routes = data.routes;
      } else {
        filtered_routes = data.routes.filter((route) => {
          if (route.src === this.state.airport_code || route.dest === this.state.airport_code) {
            return true;
          } else {
            return false;
          }
        });
      }

    } else {
      selected_airline_code = data.airlines.filter((airline) => (
        airline.name === selected_airline
      ))[0].id;

      if (this.state.airport_code === null) {
        filtered_routes = data.routes.filter((route) =>
          data.getAirlineById(route.airline) === selected_airline
        );
      } else {
        filtered_routes = data.routes.filter((route) => {
          if (route.airline === selected_airline_code) {
            if (route.src === this.state.airport_code || route.dest === this.state.airport_code) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        });
      }
    }

    this.setState({
      routes: filtered_routes,
      airline_code: selected_airline_code,
      airline_list: this.generateAirlineList(
        filtered_routes,
        selected_airline_code,
        this.state.airport_code,
      ),
      airport_list: this.generateAirportList(
        filtered_routes,
        selected_airline_code,
        this.state.airport_code,
      ),
    });
  };

  updateTableForAirport = (event) => {
    let selected_airport = event.target.value;
    let selected_airport_code = null;

    let filtered_routes;
    let current_airline_code = this.state.airline_code;

    if (selected_airport === 'All') {
      selected_airport_code = null;
      if (current_airline_code === null) {
        filtered_routes = data.routes;
      } else {
        filtered_routes = data.routes.filter((route) => {
          return route.airline === current_airline_code;
        });
      }
    } else {
      selected_airport_code = data.airports.filter((airport) => (
        airport.name === selected_airport
      ))[0].code;

      if (current_airline_code === null) {
        filtered_routes = data.routes.filter((route) => {
          return route.src === selected_airport_code || route.dest === selected_airport_code;
        });
      } else {
        filtered_routes = data.routes.filter((route) => {
          if (route.airline === current_airline_code) {
            return route.src === selected_airport_code || route.dest === selected_airport_code;
          } else {
            return false;
          }
        });
      }
    }

    this.setState({
      routes: filtered_routes,
      airport_code: selected_airport_code,
      airline_list: this.generateAirlineList(
        filtered_routes,
        this.state.airline_code,
        selected_airport_code,
      ),
      airport_list: this.generateAirportList(
        filtered_routes,
        this.state.airline_code,
        selected_airport_code,
      ),
    });
  }

  generateAirlineList = (routes, airline_code, airport_code) => {
    let list = [];
    if (airport_code !== null && airline_code === null) {
      data.routes.forEach((route) => {
        if (route.src === airport_code || route.dest === airport_code) {
          list.push(route.airline);
        }
      });

      return (
        list.filter((airline, index) => {
          if (list.indexOf(airline) === index) {
            return true;
          } else {
            return false;
          }
        })
      );
    }

    if (airline_code === null) {
      return [];
    } else {
      let route = routes.find((route) => route.airline === airline_code);
      return [route.airline];
    }
  }

  generateAirportList = (routes, airline_code, airport_code) => {
    let list = [];

    if (airline_code === null) {
      routes.forEach((route) => {
        if (route.src === airport_code) {
          list.push(route.dest);
        } else if (route.dest === airport_code) {
          list.push(route.src);
        }
      });
      list.push(airport_code);
    } else {
      routes.forEach((route) => {
        if (route.airline === airline_code) {
          list.push(route.src);
          list.push(route.dest);
        }
      });
    }

    return (
      list.filter((airport, index) => {
        if (list.indexOf(airport) === index) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  render() {
    return (
      <div className="app">
        <header className="header">
          <h1 className="title">Airline Routes</h1>
        </header>
        <section>
          <p>
            Welcome to the app!
          </p>
        </section>
        <Select
          updateTableForAirline={this.updateTableForAirline}
          updateTableForAirport={this.updateTableForAirport}
          routes={this.state.routes}
          airline_code={this.state.airline_code}
          airport_code={this.state.airport_code}
          airline_list={this.state.airline_list}
          airport_list={this.state.airport_list}
          reset={this.reset}
        />
      </div>
    );
  }
}

class Select extends Component {

  state = {
    start_index: 0,
    end_index: this.props.routes.length > 25 ? 24 : this.props.length,
  }

  nextPage = () => {
    this.setState({
      start_index: this.state.start_index + 25,
      end_index:  this.state.end_index + 25,
    });
  };

  prevPage =() => {
    this.setState({
      start_index: this.state.start_index - 25,
      end_index: this.state.end_index - 25,
    });
  }

  submitNextPage = () => {
    if (this.state.end_index + 25 > this.props.routes.length) {
      return true;
    } else {
      return false;
    }
  };

  submitPrevPage = () => {
    if (this.state.start_index - 25 < 0) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const columns = [
      {name: 'Airline', property: 'airline'},
      {name: 'Source Airport', property: 'src'},
      {name: 'Destination Airport', property: 'dest'},
    ];

    return (
      <div>
        <SelectList
          updateTableForAirline={this.props.updateTableForAirline}
          updateTableForAirport={this.props.updateTableForAirport}
          airline_code={this.props.airline_code}
          airport_code={this.props.airport_code}
          airline_list={this.props.airline_list}
          airport_list={this.props.airport_list}
          reset={this.props.reset}
        />
        <Table
          className="routes-table"
          columns={columns}
          routes={this.props.routes}
          start_index={this.state.start_index}
          end_index={this.state.end_index}
        />
        <Pagination
          rows={this.props.routes.length}
          nextPage={this.nextPage}
          prevPage={this.prevPage}
          submitNextPage={this.submitNextPage}
          submitPrevPage={this.submitPrevPage}
          start_index={this.state.start_index}
          end_index={this.state.end_index}
        />
      </div>
    );
  }
}

class SelectList extends Component {
  allAirports = () => {
    return (
      data.airports.map((airport, index) => {
        return (
          <option key={index} disabled={false}>
            {data.getAirportByCode(airport.code)}
          </option>
        );
      })
    );
  };

  allAirlines = () => {
    return (
      data.airlines.map((airline, index) => {
        return (
          <option key={index} disabled={false}>
            {data.getAirlineById(airline.id)}
          </option>
        );
      })
    );
  };

  filteredAirlines = () => {
    return (
        data.airlines.map((airline, index) => {
          if (this.props.airline_list.includes(airline.id)) {
            return (
              <option key={index}>
                {data.getAirlineById(airline.id)}
              </option>
            );
          } else {
            return (
              <option key={index} disabled={true}>
                {data.getAirlineById(airline.id)}
              </option>
            );
          }
        }
      )
    )
  };

  filteredAirport = () => {
    if (this.props.airport_list[0] === null) {
      return (
        data.airports.map((airport, index) =>
          <option key={index}>
            {data.getAirportByCode(airport.code)}
          </option>
        )
      );
    }
    return (
      data.airports.map((airport, index) => {
        if (this.props.airport_list.includes(airport.code)) {
          return (
            <option key={index}>
              {data.getAirportByCode(airport.code)}
            </option>
          );
        } else {
          return (
            <option key={index} disabled={true}>
              {data.getAirportByCode(airport.code)}
            </option>
          );
        }
      })
    );
  };

  render() {
    return (
      <div style={{margin: '0 auto', width: '75%',}}>
        <p style={{display: 'inline-block',}}>Show routes on</p>
        <select className="select" onChange={this.props.updateTableForAirline}>
          <option value="All Airlines">All Airlines</option>
          {
            this.props.airline_list.length === 0 ?
            this.allAirlines() :
            this.filteredAirlines()
          }
        </select>
        <p style={{display: 'inline-block',}}>flying in or out of</p>
        <select className="select" onChange={this.props.updateTableForAirport}>
          <option value="All Airports">All Airports</option>
          {
            this.props.airport_list.length === 0 ?
            this.allAirports() :
            this.filteredAirport()
          }
        </select>
        <button onClick={this.props.reset} value="All">
          Show All Routes
        </button>
      </div>
    );
  }
}

class Table extends Component {
  render() {
    const all_routes = this.props.routes.map((airline_data, index) => (
      <tr key={index}>
        <td>{data.getAirlineById(airline_data.airline)}</td>
        <td>{data.getAirportByCode(airline_data.src)}</td>
        <td>{data.getAirportByCode(airline_data.dest)}</td>
      </tr>
    ));

    return (
      <div>
        <table className={this.props.className}>
          <thead>
            <tr>
              <th>{this.props.columns[0].name}</th>
              <th>{this.props.columns[1].name}</th>
              <th>{this.props.columns[2].name}</th>
            </tr>
          </thead>
          <tbody>
            {
              all_routes.slice(this.props.start_index, this.props.end_index + 1)
            }
          </tbody>
        </table>
      </div>
    );
  }
}

class Pagination extends Component {
  render() {
    return (
      <section>
        <p>
          Showing {
            this.props.start_index + 1
          }
          -
          {
            this.props.rows > 25 ? this.props.end_index + 1 : this.props.rows
          }
          &nbsp;of {this.props.rows} routes
        </p>
        <button
          onClick={this.props.prevPage}
          disabled={this.props.submitPrevPage()}
        >
          Previous Page
        </button>&nbsp;
        <button
          onClick={this.props.nextPage}
          disabled={this.props.submitNextPage()}
        >
          Next Page
        </button>
      </section>
    );
  }
}

export default App;
