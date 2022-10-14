import { Box, Button, Paper } from "@mui/material";
import { NumericFormat } from "react-number-format";
import MultipleStopIcon from "@mui/icons-material/MultipleStop";

type SumupProps = {
  total: number;
};

export const Sumup = ({ total }: SumupProps) => {
  return (
    <Paper className="my-paper" sx={{display:'flex'}}>
      <NumericFormat
        className="amount"
        value={total}
        displayType="text"
        allowLeadingZeros
        thousandSeparator=" "
        suffix="€"
      />

      <Box sx={{flex:1, display:'flex', alignItems:'end', justifyContent:'end'}}>
      <Button variant="contained" startIcon={<MultipleStopIcon />}>
        Opération
      </Button>
      </Box>
    </Paper>
  );
};
