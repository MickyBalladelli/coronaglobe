import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const WhiteTextTypography = withStyles({
  root: {
    color: "#FFFFFF"
  }
})(Typography);

export default function Console () {
  return (
    <div className="App" style={{ backgroundColor: "black" }}>
      <WhiteTextTypography variant="p">
        This text should be white
      </WhiteTextTypography>
    </div>
  )
}