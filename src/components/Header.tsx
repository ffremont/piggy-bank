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
import ShareIcon from '@mui/icons-material/Share';
import { useState } from "react";

type HeaderProps = {
  exportUrl: string;
};

export const Header = ({ exportUrl }: HeaderProps) => {
  const shareFeatureEnabled = !!window.navigator.share;
  const [notify, setNotify] = useState(false);

  const handleCopyExport = () => {
    setNotify(true);
  }
  const handleClickShare = () => {
    window.navigator.share({
      title: 'Piggy Home Bank',
      text: `Export des cagnottes ${(new Date()).toLocaleString()}`,
      url: exportUrl,
    });
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <SavingsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'Montserrat' }}>
            Piggy Home Bank
          </Typography>
          <Box>
            {shareFeatureEnabled && <IconButton onClick={handleClickShare} color="default" aria-label="export url">
                <ShareIcon />
              </IconButton>}

            {!shareFeatureEnabled && <CopyToClipboard
              text={exportUrl}
              onCopy={handleCopyExport}
            >
              <IconButton color="default" aria-label="export url">
                <ContentCopyIcon />
              </IconButton>
            </CopyToClipboard>}
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
