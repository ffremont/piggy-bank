import clsx from "clsx";
import { NumericFormat } from "react-number-format";
import { useLongPress } from "use-long-press";
import { PiggyBankType } from "../types/PiggyBankType";

export const PiggyBank = ({ icon, color, amount, label, onDelete }: PiggyBankType&{onDelete:() => void}) => {
    const bindLongPressDelete = useLongPress(onDelete);
  return (
    <div className={clsx("piggy-bank", color)} {...bindLongPressDelete()}>
      <span className="my-icon material-symbols-outlined">{icon}</span>
      <span className="my-label">{label}</span>
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
