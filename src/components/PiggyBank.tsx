import clsx from "clsx";
import { NumericFormat } from "react-number-format";
import { PiggyBankType } from "../types/PiggyBankType";

export const PiggyBank = ({ icon, color, amount }: PiggyBankType) => {
  return (
    <div className={clsx("piggy-bank", color)}>
      <span className="my-icon material-symbols-outlined">{icon}</span>
      
      <NumericFormat
        className="amount"
        value={amount}
        displayType="text"
        allowLeadingZeros
        thousandSeparator=" "
        suffix="€"
      />
    </div>
  );
};
