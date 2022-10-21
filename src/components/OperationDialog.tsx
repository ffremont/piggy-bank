import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { PiggyBankType } from "../types/PiggyBankType";

type OperationDialogProps = {
  items: PiggyBankType[];
  show: boolean;
  onHide: () => void;
  onModify: (from: PiggyBankType, to: PiggyBankType) => void;
};

export const OperationDialog = ({
  items,
  show,
  onHide,
  onModify,
}: OperationDialogProps) => {
  const [open, setOpen] = useState(false);
  const fromItems: PiggyBankType[] = [
    {
      id: "in",
      label: "Compte source",
      icon: "arrow_forward",
      amount: 1000000000000000000000000000000,
      color: "default",
    },
    ...items,
  ];
  const toItems: PiggyBankType[] = [
    {
      id: "out",
      label: "Compte cible",
      icon: "arrow_back",
      amount: -1,
      color: "default",
    },
    ...items,
  ];

  useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleClose = () => {
    setOpen(false);
    onHide();
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps: any = Object.fromEntries(formData);

    const { amount, destination, source } = formProps;
    const nAmount = parseFloat(amount);
    if (destination === "out" && source === "in")
      return alert("Combinaison impossible");

     const from = fromItems.find(i => i.id === source) as PiggyBankType; 
     const to = toItems.find(i => i.id === destination) as  PiggyBankType; 

     if((from.amount - nAmount) < 0) return alert(`"${from.label}" n'a pas assez d'argent`);

     from.amount = from.amount - nAmount;
     to.amount = to.amount + nAmount;

     onModify(from,to);
  };

  return (
    <Dialog
      open={open}
      fullScreen={true}
      className="my-dialog"
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Nouvelle opération"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="my-dialog-content">
          <FormControl sx={{ marginTop: "10px" }} fullWidth>
            <TextField
              required
              label="Montant (€)"
              inputProps={{
                step: "0.01",
              }}
              name="amount"
              type="number"
              variant="outlined"
            />
          </FormControl>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Box
              sx={{
                width: "50px",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <SwapVertIcon sx={{ fontSize: "2.5rem", opacity: 0.5 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormControl sx={{ marginTop: "10px" }} fullWidth>
                <InputLabel id="op-simple-select-label">Source</InputLabel>
                <Select
                  labelId="op-simple-select-label"
                  id="op-simple-select"
                  label="Source"
                  name="source"
                  defaultValue={fromItems[0].id}
                  required
                >
                  {fromItems.map((item: PiggyBankType) => (
                    <MenuItem
                      className="my-select-item"
                      key={item.id}
                      value={item.id}
                    >
                      <span className="my-icon material-symbols-outlined">
                        {item.icon}
                      </span>{" "}
                      {item.label} {item.id !== 'in' ? `(${item.amount}€)` : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ marginTop: "10px" }} fullWidth>
                <InputLabel id="to-simple-select-label">Destination</InputLabel>
                <Select
                  labelId="to-simple-select-label"
                  id="to-simple-select"
                  label="Destination"
                  name="destination"
                  defaultValue={toItems[0].id}
                  className="my-select"
                  required
                >
                  {toItems.map((item: PiggyBankType) => (
                    <MenuItem
                      className="my-select-item"
                      key={item.id}
                      value={item.id}
                    >
                      <span className="my-icon material-symbols-outlined">
                        {item.icon}
                      </span>{" "}
                      {item.label} {item.id !== 'out'  ? `(${item.amount}€)` : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button type="submit">Ajouter</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
