import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PiggyBankType } from "../types/PiggyBankType";

type AddDialogProps = {
  show: boolean
  onHide: () => void
  onAdd: (data: PiggyBankType) => void
};

export const AddDialog = ({ show, onHide, onAdd }: AddDialogProps) => {
  const [open, setOpen] = useState(false);

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
    const formProps:any = Object.fromEntries(formData);
    
    onAdd({
        id: formProps.name.toLowerCase(),
        label: formProps.name,
        icon: formProps.icon,
        color: formProps.style,
        amount:0
    });
  };

  const icons = [
    "shopping_cart",
    "smartphone",
    "beach_access",
    "volunteer_activism",
    "redeem",
    "computer",
    "magic_button",
    "holiday_village",
    "savings",
    "account_balance",
    "e911_emergency",
    "import_contacts",
    "home",
    "alternate_email",
  ];
  return (
    <Dialog
      open={open}
      fullScreen={true}
      className="my-dialog"
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Créer nouvel espace"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="my-dialog-content">
          <FormControl sx={{ marginTop: "10px" }} fullWidth>
            <TextField required label="Nom" name="name" variant="outlined" />
          </FormControl>
          <FormControl sx={{ marginTop: "10px" }} fullWidth>
            <InputLabel id="icon-simple-select-label">Icon</InputLabel>
            <Select
              labelId="icon-simple-select-label"
              id="icon-simple-select"
              label="Icon"
              name="icon"
              defaultValue={icons[0]}
              required
            >
              {icons.map((icon) => (
                <MenuItem className="my-select-item" key={icon} value={icon}>
                  <span className="my-icon material-symbols-outlined">
                    {icon}
                  </span>{" "}
                  {icon}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ marginTop: "10px" }} fullWidth>
            <InputLabel id="style-simple-select-label">Style</InputLabel>
            <Select
              labelId="style-simple-select-label"
              id="style-simple-select"
              label="Style"
              name="style"
              required
              defaultValue={"default"}
            >
              <MenuItem value={"default"}>Défaut</MenuItem>
              <MenuItem value={"primary"}>Principal</MenuItem>
              <MenuItem value={"secondary"}>Secondaire</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button type="submit">Ajouter</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
