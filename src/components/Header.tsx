import {
  AppBar,
  Box,
  Button,
  IconButton,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";
import CopyToClipboard from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

type HeaderProps = {
  exportUrl: string;
};

export const Header = ({ exportUrl }: HeaderProps) => {
  const [notify, setNotify] = useState(false);

  const handleCopyExport = () => {
    setNotify(true);
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <SavingsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Piggy Home Bank
          </Typography>
          <Box>
            <CopyToClipboard
              text={exportUrl}
              onCopy={handleCopyExport}
            >
              <IconButton color="default" aria-label="export url">
                <ContentCopyIcon />
              </IconButton>
            </CopyToClipboard>
          </Box>
        </Toolbar>
      </AppBar>
      <Snackbar
        open={notify}
        autoHideDuration={6000}
        onClose={() => setNotify(false)}
        message="🔗 Données exportées dans le presse-papier"
      />
    </>
  );
};
