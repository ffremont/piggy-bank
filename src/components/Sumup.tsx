import { Paper } from "@mui/material";
import { NumericFormat } from "react-number-format";

export const Sumup = () => {
  return (
    <Paper className="my-paper">
      
        <NumericFormat
        className="amount"
          value={1234.5}
          displayType="text"
          allowLeadingZeros
          thousandSeparator=" "
          suffix="€"
        />
      
    </Paper>
  );
};
