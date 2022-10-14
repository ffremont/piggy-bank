import { Container } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { PiggyBank } from "./components/PiggyBank";
import { Sumup } from "./components/Sumup";
import { PiggyBankType } from "./types/PiggyBankType";
import * as CryptoJS from "crypto-js";
import { AddPiggyBank } from "./components/AddPiggyBank";
import { AddDialog } from "./components/AddDialog";
import { useLongPress } from "use-long-press";

const LS_KEY = "piggyBank";
const secretFactory = (nonce: string, pin: string) => `${nonce}_${pin}`;

function App() {
  const [addShowDialog, setAddShowDialog] = useState(false);
  const [items, setItems] = useState<PiggyBankType[]>([
    {
      amount: 1223,
      id: "",
      label: "Epargne",
      icon: "settings",
      color: "default",
    },
    {
      amount: 1223,
      id: "",
      label: "Epargne",
      icon: "holiday_village",
      color: "secondary",
    },
  ]);
  const [pin, setPin] = useState<string>("");
  const [exportUrl, setExportUrl] = useState("");
  const nonce = useRef("");

  
  const handleOnDeletePiggyBank  = (item: PiggyBankType) => {
    if(window.confirm(`Confirmez-vous la suppression de "${item.label}" ?`)){
      setItems(items.filter(i => i.id !== item.id));
    }
  };
  const handleAddPiggyBank = (item: PiggyBankType) => {
    setItems([item, ...items]);
    setAddShowDialog(false);
  }

  /**
   * @see https://github.com/brix/crypto-js
   * @see https://github.com/rotemdan/lzutf8.js/
   */
  useEffect(() => {
    nonce.current = window.location.pathname;
    // systématiquement on demande le pin
    let myPin = "0000"; //window.prompt(`Code pin ? `)||'';
    setPin(myPin);

    const cryptedLS = window.localStorage.getItem(LS_KEY);
    const itemsFromLS = cryptedLS
      ? JSON.parse(
          CryptoJS.AES.decrypt(
            cryptedLS,
            secretFactory(nonce.current, myPin)
          ).toString(CryptoJS.enc.Utf8)
        )
      : [
          {
            amount: 1223,
            id: "oo",
            label: "Epargne",
            icon: "settings",
            target: 5000,
            color: "default",
          },
          {
            amount: 1223,
            id: "k",
            label: "Epargne",
            icon: "holiday_village",
            target: 5000,
            color: "secondary",
          },
        ];

    const urlParams = new URLSearchParams(window.location.search);
    const importEncryptDataLZU = urlParams.get("import");
    if (
      importEncryptDataLZU &&
      window.confirm(`Confirmez-vous l'importation ?`)
    ) {
      const encryptedData = (window as any).LZUTF8.decompress(
        importEncryptDataLZU,
        { inputEncoding: "Base64" }
      );
      const importJson = CryptoJS.AES.decrypt(
        encryptedData,
        secretFactory(nonce.current, myPin)
      ).toString(CryptoJS.enc.Utf8);

      console.log("imported json " + importJson);
      const cryptedData = CryptoJS.AES.encrypt(
        importJson,
        secretFactory(nonce.current, myPin)
      ).toString();
      window.localStorage.setItem(LS_KEY, cryptedData);

      window.location.href = `${window.location.origin}${window.location.pathname}`;
    } else {
      console.log("init : ", itemsFromLS);
      setItems(itemsFromLS);
    }
  }, []);

  useEffect(() => {
    if (pin) {
      const cryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(items),
        secretFactory(nonce.current, pin)
      ).toString();
      window.localStorage.setItem(LS_KEY, cryptedData);
      const compressed = (window as any).LZUTF8.compress(cryptedData, {
        outputEncoding: "Base64",
      });
      setExportUrl(
        `${window.location.origin}${window.location.pathname}?import=${compressed}`
      );
    }
  }, [items, pin]);

  return (
    <div className="App">
      <Header exportUrl={exportUrl} />
      <Container sx={{ marginTop: "20px" }}>
        <AddDialog
          show={addShowDialog}
          onHide={() => setAddShowDialog(false)}
          onAdd={handleAddPiggyBank}
        />
        <Sumup total={items.map(item => item.amount).reduce((a,b) => a+b, 0)} />
        <div className="my-list">
          {items.map((item, index) => (
            <PiggyBank onDelete={() => handleOnDeletePiggyBank(item)} {...item} key={index} />
          ))}
          <AddPiggyBank onClick={(() => setAddShowDialog(true))} />
        </div>
      </Container>
    </div>
  );
}

export default App;
