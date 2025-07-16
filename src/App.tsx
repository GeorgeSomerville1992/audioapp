import './App.css';
import { Home } from './components/Home';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';

export const App = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
