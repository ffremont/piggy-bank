import { Alert, Button, Container, Snackbar, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { PiggyBank } from "./components/PiggyBank";
import { Sumup } from "./components/Sumup";
import { PiggyBankType } from "./types/PiggyBankType";
import * as CryptoJS from "crypto-js";
import { AddPiggyBank } from "./components/AddPiggyBank";
import { AddDialog } from "./components/AddDialog";
import { OperationDialog } from "./components/OperationDialog";

const LS_KEY = (nonce: string, pin: string) =>
  `piggyBank_${CryptoJS.SHA256(nonce).toString().slice(-8)}`;
const LS_VERSION_KEY = (mainKey: string) => `v${mainKey}`;
const secretFactory = (nonce: string, pin: string) => `${nonce}_${pin}`;

function App() {
  const [addShowDialog, setAddShowDialog] = useState(false);
  const [invalidPin, setInvalidPin] = useState(false);
  const [addShowOperation, setAddShowOperation] = useState(false);
  const [notifyOperation, setNotifyOperation] = useState(false);
  const [items, setItems] = useState<PiggyBankType[]>([]);
  const [pin, setPin] = useState<string>("");
  const [exportUrl, setExportUrl] = useState("");
  const nonce = useRef("");
  const version = useRef(1);

  const handleModifyOperation = (from: PiggyBankType, to: PiggyBankType) => {
    setItems(
      items.map((i) => {
        if (i.id === from.id) {
          return from;
        } else if (i.id === to.id) {
          return to;
        } else {
          return i;
        }
      })
    );
    setNotifyOperation(true);
    setAddShowOperation(false);
  };
  const handleOnDeletePiggyBank = (item: PiggyBankType) => {
    if (window.confirm(`Confirmez-vous la suppression de "${item.label}" ?`)) {
      setItems(items.filter((i) => i.id !== item.id));
    }
  };
  const handleAddPiggyBank = (item: PiggyBankType) => {
    setItems([item, ...items]);
    setAddShowDialog(false);
  };

  /**
   * @see https://github.com/brix/crypto-js
   * @see https://github.com/rotemdan/lzutf8.js/
   */
  useEffect(() => {
    nonce.current = window.location.pathname;
    // systématiquement on demande le pin
    let myPin = window.prompt(`Code pin ? `) || "";
    setPin(myPin);

    const mainLSKey = LS_KEY(nonce.current, myPin);
    const cryptedLS = window.localStorage.getItem(mainLSKey);
    const versionLS = JSON.parse(window.localStorage.getItem(LS_VERSION_KEY(mainLSKey))||"1");
    let itemsFromLS = [];
    try {
      itemsFromLS = cryptedLS
        ? JSON.parse(
            CryptoJS.AES.decrypt(
              cryptedLS,
              secretFactory(nonce.current, myPin)
            ).toString(CryptoJS.enc.Utf8)
          )
        : [];
    } catch (e) {
      setInvalidPin(true);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const importEncryptDataLZU = urlParams.get("import");
    const importVersion = parseInt(urlParams.get("version")||"1", 10);
    if (
      importEncryptDataLZU &&
      window.confirm(`Confirmez-vous l'importation v${importVersion} ?`)
    ) {
      const encryptedData = (window as any).LZUTF8.decompress(
        importEncryptDataLZU,
        { inputEncoding: "Base64" }
      );
      const importJson = CryptoJS.AES.decrypt(
        encryptedData,
        secretFactory(nonce.current, myPin)
      ).toString(CryptoJS.enc.Utf8);

      const cryptedData = CryptoJS.AES.encrypt(
        importJson,
        secretFactory(nonce.current, myPin)
      ).toString();
      const mainLS = LS_KEY(nonce.current, myPin);
      const newVersion = importVersion + 1;
      window.localStorage.setItem(mainLS, cryptedData);
      window.localStorage.setItem(LS_VERSION_KEY(mainLS), JSON.stringify(newVersion));

      setItems(JSON.parse(importJson));
      version.current = newVersion;
      window.location.href = `${window.location.origin}${window.location.pathname}`;
    } else {
      setItems(itemsFromLS);
      version.current = versionLS;
    }
  }, []);

  useEffect(() => {
    if (pin && !invalidPin) {
      const cryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(items),
        secretFactory(nonce.current, pin)
      ).toString();
      window.localStorage.setItem(LS_KEY(nonce.current, pin), cryptedData);

      const compressed = (window as any).LZUTF8.compress(cryptedData, {
        outputEncoding: "Base64",
      });
      setExportUrl(
        `${window.location.origin}${window.location.pathname}?import=${compressed}&version=${version.current}`
      );
    }
  }, [items, pin]);

  return (
    <div className="App">
      <Header exportUrl={exportUrl} />
      {invalidPin && (
        <Container
          sx={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h2">Code d'accès invalide</Typography>
          <Button onClick={() => window.location.reload()} type="button">
            Réessayer
          </Button>
        </Container>
      )}
      {!invalidPin && (
        <Container sx={{ marginTop: "20px" }}>
          <AddDialog
            show={addShowDialog}
            onHide={() => setAddShowDialog(false)}
            onAdd={handleAddPiggyBank}
          />
          <OperationDialog
            show={addShowOperation}
            onHide={() => setAddShowOperation(false)}
            onModify={handleModifyOperation}
            items={items}
          />
          <Sumup
            onClickOperation={() => setAddShowOperation(true)}
            total={items.map((item) => item.amount).reduce((a, b) => a + b, 0)}
          />
          <div className="my-list">
            {items.map((item, index) => (
              <PiggyBank
                onDelete={() => handleOnDeletePiggyBank(item)}
                {...item}
                key={index}
              />
            ))}
            <AddPiggyBank onClick={() => setAddShowDialog(true)} />
          </div>
          <Snackbar
            sx={{ width: "calc(100% - 40px)" }}
            open={notifyOperation}
            autoHideDuration={6000}
            onClose={() => setNotifyOperation(false)}
          >
            <Alert sx={{ width: "100%" }} severity="success">
              Opération enregistrée
            </Alert>
          </Snackbar>
        </Container>
      )}
    </div>
  );
}

export default App;
