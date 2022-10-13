import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { PiggyBank } from "./components/PiggyBank";
import { Sumup } from "./components/Sumup";
import { PiggyBankType } from "./types/PiggyBankType";

const LS_KEY = "piggyBank";

function App() {
  const [items, setItems] = useState<PiggyBankType[]>([]);
  const data: PiggyBankType[] = [
    {
      amount: 1223,
      id: "",
      label: "Epargne",
      icon: "settings",
      target: 5000,
      color: "default",
    },
    {
      amount: 1223,
      id: "",
      label: "Epargne",
      icon: "holiday_village",
      target: 5000,
      color: "secondary",
    },
  ];
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const importData64 = urlParams.get("import");

    const itemsFromLS = JSON.parse(window.localStorage.getItem(LS_KEY) || "[]");
    if(importData64 && window.confirm(`Confirmez-vous l'importation ?`)){
      setItems(JSON.parse(Buffer.from(importData64, 'base64').toString('utf8')));
    }else{
      setItems(itemsFromLS);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  return (
    <div className="App">
      <Header />
      <Container sx={{ marginTop: "20px" }}>
        <Sumup total={1234.5} />

        <div className="my-list">
          {data.map((item, index) => (
            <PiggyBank {...item} key={index} />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default App;
