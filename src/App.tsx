import { Container } from "@mui/material";
import { Header } from "./components/Header";
import { Sumup } from "./components/Sumup";

function App() {
  return (
    <div className="App">
      <Header />
      <Container sx={{marginTop:'20px'}}>
        <Sumup />
      </Container>
    </div>
  );
}

export default App;
