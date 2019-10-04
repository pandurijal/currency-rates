import React, { Component } from "react";
import {
  Grid,
  Button,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from "@material-ui/core";
import ReactSelect from "react-select";

import Header from "./components/Header";

import "./dist/app.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: "USD",
      showed: [
        "USD",
        "CAD",
        "IDR",
        "GBP",
        "CHF",
        "SGD",
        "INR",
        "MYR",
        "JPY",
        "KRW"
      ],
      rateList: [],
      value: 10,
      modal: false,
      selectedCurrency: ""
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.handleRatesChanged();
    }
  }

  // fetch data from API
  fetchData = async () => {
    const { base } = this.state;
    try {
      const get = await fetch(
        `https://api.exchangeratesapi.io/latest?base=${base}`
      );
      const res = await get.json();

      this.setState({
        rateList: Object.keys(res.rates).map(key => ({
          id: key,
          rates: res.rates[key],
          baseRates: res.rates[key],
          show: false
        }))
      });

      this.setShowed();
    } catch (e) {
      console.error(e);
    }
  };

  // set which currency showed based on [showed]
  setShowed = res => {
    let { rateList, showed } = this.state;
    showed.map(show => {
      const index = rateList.findIndex(data => data.id === show);
      return (rateList[index].show = true);
    });
    this.setState({
      rateList
    });

    this.handleRatesChanged();
  };

  // handle changes rates
  handleRatesChanged = () => {
    const { rateList, value } = this.state;
    let arrRates = [...rateList];
    if (value) {
      arrRates.map(data => {
        return (data.rates = data.baseRates * value);
      });
    } else {
      arrRates.map(data => {
        return (data.rates = data.baseRates);
      });
    }
    this.setState({
      rateList: arrRates
    });
  };

  // handle initial value changed
  handleValueChanged = e => {
    const { value } = e.target;
    this.setState({
      value
    });
  };

  // handle select new currency
  handleSelectChanged = e => {
    const { value } = e;
    this.setState({
      selectedCurrency: value
    });
  };

  // handle add new currency
  handleAddCurrency = () => {
    const { selectedCurrency, showed, rateList } = this.state;

    const arrIndex = rateList.findIndex(data => data.id === selectedCurrency);
    const arrRates = [...rateList];
    arrRates[arrIndex].show = true;

    showed.push(selectedCurrency);

    this.setState({
      rateList: arrRates,
      modal: false
    });
  };

  // handle remove selected currency
  handleRemoveCurrency = id => {
    const { showed, rateList } = this.state;

    const arrIndex = rateList.findIndex(data => data.id === id);
    const arrRates = [...rateList];
    arrRates[arrIndex].show = false;

    showed.filter(data => data !== id);

    this.setState({
      rateList: arrRates
    });
  };

  handleOpenDialog = () => {
    this.setState({
      modal: true
    });
  };

  handleCloseDialog = () => {
    this.setState({
      modal: false
    });
  };

  render() {
    const { rateList } = this.state;
    const filterredRateList = rateList.filter(data => {
      return !data.show;
    });
    return (
      <div className="app">
        <div className="container">
          <Header
            baseCurrency={this.state.base}
            value={this.state.value}
            onChangeValue={this.handleValueChanged}
          />
          <div className="list-wrapper">
            {rateList &&
              rateList.map((data, index) => {
                // Only show data when `show` === true
                if (data.show) {
                  return (
                    <Paper
                      className="list-content"
                      key={`${data.id} - ${index}`}
                    >
                      <Grid container spacing={8}>
                        <Grid item sm={8}>
                          <p className="title">{data.id}</p>
                          <span>{`1 USD = ${data.id} ${data.baseRates}`}</span>
                        </Grid>
                        <Grid item sm={3}>
                          <p className="rates">{data.rates.toFixed(2)}</p>
                        </Grid>
                        <Icon
                          className="icon-delete"
                          onClick={() => this.handleRemoveCurrency(data.id)}
                        >
                          close
                        </Icon>
                      </Grid>
                    </Paper>
                  );
                }
              })}
          </div>
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleOpenDialog}
          >
            + Add Currenncy
          </Button>
        </div>
        <Dialog
          open={this.state.modal}
          onClose={this.handleCloseDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Currenncy</DialogTitle>
          <DialogContent>
            <ReactSelect
              className="react-select"
              classNamePrefix="react-select"
              options={filterredRateList.map(data => ({
                label: data.id,
                value: data.id
              }))}
              onChange={this.handleSelectChanged}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleCloseDialog}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleAddCurrency}
              color="primary"
              variant="contained"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default App;
