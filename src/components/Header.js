import React from "react";
import { Grid, TextField } from "@material-ui/core";

const Header = props => {
  return (
    <div className="header-wrapper">
      <Grid container spacing={8}>
        <Grid item sm={9}>
          <span>{props.baseCurrency}</span>
        </Grid>
        <Grid item sm={3}>
          <TextField
            type="number"
            value={props.value}
            onChange={props.onChangeValue}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Header;
