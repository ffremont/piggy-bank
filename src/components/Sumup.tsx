import { Paper } from "@mui/material";
import { NumericFormat } from "react-number-format";

type SumupProps = {
  total: number;
};

export const Sumup = ({ total }: SumupProps) => {
  return (
    <Paper className="my-paper">
      <NumericFormat
        className="amount"
        value={total}
        displayType="text"
        allowLeadingZeros
        thousandSeparator=" "
        suffix="€"
      />
    </Paper>
  );
};
