
import { useState } from 'react';
import './App.css';

import ChampionSelector from './ChampionSelector';
const splashBase = '/splasharts/Champ original splash art/';
const iconBase = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/';
// Placeholder: este formato permite recibir múltiples roles por campeón desde el backend
const champions = [
  { name: 'Darius', roles: ['top'], img: splashBase + 'Darius.jpg', icon: iconBase + '6.png' },
  { name: 'Yasuo', roles: ['middle'], img: splashBase + 'Yasuo.jpg', icon: iconBase + '157.png' },
  { name: 'Jinx', roles: ['bottom'], img: splashBase + 'Jinx.jpg', icon: iconBase + '222.png' },
  { name: 'Thresh', roles: ['utility'], img: splashBase + 'Thresh.jpg', icon: iconBase + '412.png' },
  { name: 'Lee Sin', roles: ['jungle'], img: splashBase + 'Lee_Sin.jpg', icon: iconBase + '64.png' },
  { name: 'Garen', roles: ['top'], img: splashBase + 'Garen.jpg', icon: iconBase + '86.png' },
  { name: 'Lux', roles: ['middle', 'utility'], img: splashBase + 'Lux.jpg', icon: iconBase + '99.png' },
  { name: 'Ezreal', roles: ['bottom'], img: splashBase + 'Ezreal.jpg', icon: iconBase + '81.png' },
  { name: 'Leona', roles: ['utility'], img: splashBase + 'Leona.jpg', icon: iconBase + '89.png' },
  { name: 'Kayn', roles: ['jungle'], img: splashBase + 'Kayn.jpg', icon: iconBase + '141.png' }
];

const roles = [
  { value: '', label: 'Todos' },
  { value: 'top', label: 'Top' },
  { value: 'jg', label: 'Jungla' },
  { value: 'mid', label: 'Mid' },
  { value: 'adc', label: 'ADC' },
  { value: 'support', label: 'Support' }
];

function App() {
  const [roleAlly, setRoleAlly] = useState('');
  const [roleEnemy, setRoleEnemy] = useState('');
  const [searchAlly, setSearchAlly] = useState('');
  const [searchEnemy, setSearchEnemy] = useState('');
  const [allies, setAllies] = useState([]);
  const [enemies, setEnemies] = useState([]);

  const filteredAlly = champions.filter(
    champ => (roleAlly === '' || champ.roles.includes(roleAlly)) && champ.name.toLowerCase().includes(searchAlly.toLowerCase()) && !allies.includes(champ.name) && !enemies.includes(champ.name)
  );
  const filteredEnemy = champions.filter(
    champ => (roleEnemy === '' || champ.roles.includes(roleEnemy)) && champ.name.toLowerCase().includes(searchEnemy.toLowerCase()) && !allies.includes(champ.name) && !enemies.includes(champ.name)
  );

  const handlePickAlly = (name) => {
    if (allies.length < 5 && !allies.includes(name) && !enemies.includes(name)) {
      setAllies([...allies, name]);
    }
  };
  const handlePickEnemy = (name) => {
    if (enemies.length < 5 && !enemies.includes(name) && !allies.includes(name)) {
      setEnemies([...enemies, name]);
    }
  };

  const removeAlly = (name) => {
    setAllies(allies.filter(n => n !== name));
  };
  const removeEnemy = (name) => {
    setEnemies(enemies.filter(n => n !== name));
  };
  const reset = () => {
    setAllies([]);
    setEnemies([]);
    setSearchAlly('');
    setSearchEnemy('');
    setRoleAlly('');
    setRoleEnemy('');
  };

  return (
    <div className="champ-select-bg">
      <div className="champ-select-container">
        <h1 className="champ-select-title">Selección de Campeones</h1>
        <div className="teams-row">
          <ChampionSelector
            title="Aliados"
            champions={filteredAlly}
            selected={allies}
            onPick={handlePickAlly}
            role={roleAlly}
            setRole={setRoleAlly}
            onRemove={removeAlly}
            allChampions={champions}
          />
          <ChampionSelector
            title="Enemigos"
            champions={filteredEnemy}
            selected={enemies}
            onPick={handlePickEnemy}
            role={roleEnemy}
            setRole={setRoleEnemy}
            onRemove={removeEnemy}
            allChampions={champions}
          />
        </div>
        <div style={{marginTop: 20}}>
          <button onClick={reset} className="reset-btn">Reiniciar selección</button>
        </div>
      </div>
    </div>
  );
}

export default App;
