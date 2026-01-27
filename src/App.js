import logo from './logo.svg';
import './App.css';
// 1. You must import the component first
import Portfolio from './Portfolio'; 

function App() {
  return (
    <div className="App">
      {/* 2. Place the component where you want it to appear */}
      <Portfolio />
      
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;