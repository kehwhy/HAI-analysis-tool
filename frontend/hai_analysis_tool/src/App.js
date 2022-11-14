import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/home";
import Tool from "./pages/tool";

export default function App() {
  return (
    <Router>
      <div>
        <Header/>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route path="/tool" element={<Tool/>}/>
        </Routes>
      </div>
    </Router>
  );
}

