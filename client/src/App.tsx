import { Route, Switch } from "wouter";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import ConfiguracoesPage from "@/pages/ConfiguracoesPage";
import VisualizacaoPage from "@/pages/VisualizacaoPage";
import EtiquetasPage from "@/pages/EtiquetasPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/configuracoes"} component={ConfiguracoesPage} />
      <Route path={"/patrimonio/:id"} component={VisualizacaoPage} />
      <Route path={"/etiquetas"} component={EtiquetasPage} />
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Toaster />
      <Router />
    </>
  );
}

export default App;
