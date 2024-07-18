import { useState } from 'react';
import colorDropperIcon from './assets/IconColorPicker.svg';
import './App.css';
import Canvas from './Canvas';
import image from './assets/image.jpg';

function App() {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isDropperSelected, setIsDropperSelected] = useState<boolean>(false);

  
  return (
    <div className='App'>
      <header className="App-header">
          <img alt='color-dropper-icon' onClick={() => setIsDropperSelected(!isDropperSelected)} className='color-picker-icon' src={colorDropperIcon} />
        <div className='selected-color-div'>
          <span className='selected-color-text'>{selectedColor}</span>
        </div>
        <div>
          <Canvas image={image} 
                  setSelectedColor={setSelectedColor}
                  isDropperSelected={isDropperSelected}
                  setIsDropperSelected={setIsDropperSelected} />
        </div>
      </header>
    </div>
  );
}

export default App;
