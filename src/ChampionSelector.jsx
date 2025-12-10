import React from 'react';

const roleNames = {
  top: 'Superior',
  jungle: 'Jungla',
  middle: 'Central',
  bottom: 'Tirador',
  utility: 'Soporte'
};
const roleIcons = {
  top: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/honor/roleicon_top.png',
  jungle: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/honor/roleicon_jungle.png',
  middle: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/honor/roleicon_middle.png',
  bottom: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/honor/roleicon_bottom.png',
  utility: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/honor/roleicon_utility.png'
};


function ChampionSelector({ title, champions, selected, onPick, role, setRole, onRemove, allChampions }) {
  // Cargar todos los campeones automáticamente desde la fuente oficial, con fallback y manejo de error
  const fallbackChamps = [
    { id: 1, name: 'Annie' },
    { id: 2, name: 'Olaf' },
    { id: 3, name: 'Galio' },
    { id: 4, name: 'Twisted Fate' },
    { id: 5, name: 'Xin Zhao' },
    { id: 6, name: 'Urgot' },
    { id: 7, name: 'LeBlanc' },
    { id: 8, name: 'Vladimir' },
    { id: 9, name: 'Fiddlesticks' },
    { id: 10, name: 'Kayle' }
  ];
  const [championList, setChampionList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  React.useEffect(() => {
    fetch('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json')
      .then(res => res.json())
      .then(data => {
        const champs = data.map(c => ({ id: c.id, name: c.name }));
        setChampionList(champs);
        setLoading(false);
      })
      .catch(() => {
        setChampionList(fallbackChamps);
        setError(true);
        setLoading(false);
      });
  }, []);

  // Obtener el objeto campeón por nombre para mostrar el icono (usar el array completo)
  const getChampionByName = (name) => allChampions?.find(c => c.name === name) || {};
  const roles = ['top', 'jungle', 'middle', 'bottom', 'utility'];
  const [search, setSearch] = React.useState('');
  // Usar championList para mostrar todos los campeones
  // Filtrar y normalizar nombres que contienen 'Doom Bot', y aplicar filtro de rol si está seleccionado
  const filteredChamps = championList
    .filter(champ => champ.name.toLowerCase() !== 'none')
    // Si el objeto champ no tiene roles, no filtrar por rol
    // Filtro de roles preparado para cuando el backend envíe la propiedad 'roles' en cada campeón
    .filter(champ => {
      if (!role) return true;
      if (!champ.roles) return true;
      return champ.roles.includes(role);
    })
    .filter(champ => champ.name.toLowerCase().includes(search.toLowerCase()))
    .map(champ => {
      let name = champ.name;
      name = name.replace(/ ?Doom Bot ?/gi, '');
      if (/Nunu *(?:&|y) *Willump/i.test(name)) {
        name = 'Nunu';
      }
      return { ...champ, name: name.trim() };
    });
  if (loading) {
    return <div className="team-block"><h2>{title}</h2><div style={{color:'#7ecfff', textAlign:'center', margin:'32px'}}>Cargando campeones...</div></div>;
  }
  if (error) {
    return <div className="team-block"><h2>{title}</h2><div style={{color:'#ffe066', textAlign:'center', margin:'32px'}}>No se pudo cargar la lista oficial. Mostrando campeones de ejemplo.</div>{/* ...existing code... */}
      <div className="team-list">
        {Array.from({ length: 5 }).map((_, i) => {
          const champName = selected[i];
          // Buscar el objeto campeón en la lista normalizada (sin filtro de búsqueda)
          const normalizedChampList = championList
            .filter(champ => champ.name.toLowerCase() !== 'none')
            .map(champ => {
              let name = champ.name;
              name = name.replace(/ ?Doom Bot ?/gi, '');
              if (/Nunu *(?:&|y) *Willump/i.test(name)) {
                name = 'Nunu';
              }
              return { ...champ, name: name.trim() };
            });
          const champObj = champName ? normalizedChampList.find(c => c.name === champName) : null;
          return champName && champObj ? (
            <div key={i} className={`team-slot filled`} onClick={() => onRemove(champName)} style={{cursor:'pointer'}} title="Eliminar">
              <img src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champObj.id}.png`} alt={champName} className="champ-icon-team" />
            </div>
          ) : (
            <div key={i} className={`team-slot`}></div>
          );
        })}
      </div>
      <div style={{width: '100%', display: 'flex', justifyContent: 'center', margin: '2px 0 0 0'}}>
        <div className="role-icons-filter" style={{display: 'flex', gap: '12px'}}>
          {roles.map(r => (
            <img
              key={r}
              src={roleIcons[r]}
              alt={roleNames[r]}
              className={`role-icon-filter${role === r ? ' active' : ''}`}
              onClick={() => setRole(role === r ? '' : r)}
            />
          ))}
        </div>
      </div>
      <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '0', marginTop: '8px'}}>
        <input
          type="text"
          className="champ-search-bar"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{width: '120px', padding: '4px 8px', fontSize: '0.95rem', borderRadius: '6px', border: 'none', background: '#1b274a', color: '#e0e6f6'}}
        />
      </div>
      <div className="champ-list champ-select-list" style={{margin: 0, padding: 0}}>
        {filteredChamps.map(champ => (
          <div
            key={champ.id}
            className={`champ champ-card ${selected.includes(champ.name) ? 'picked' : ''}`}
            onClick={() => onPick(champ.name)}
            title={champ.name}
            style={{margin: 0, padding: 0}}
          >
            <div className="champ-visual-block" style={{margin: 0, padding: 0}}>
              <img src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champ.id}.png`} alt={champ.name + ' icon'} className="champ-icon-team" style={{marginBottom: 0}} />
              <div className="champ-name" style={{marginBottom: 0, fontSize: '0.75rem'}}>{champ.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>;
  }
  return (
    <div className="team-block">
      <h2>{title}</h2>
      {/* Mostrar 4 aliados y el pick recomendado aparte SOLO si el bloque es de aliados */}
      {title.toLowerCase().includes('aliado') ? (
        <>
          <div className="team-list">
            {Array.from({ length: 4 }).map((_, i) => {
              const champName = selected[i];
              const normalizedChampList = championList
                .filter(champ => champ.name.toLowerCase() !== 'none')
                .filter(champ => !role || (champ.roles && champ.roles.includes(role)))
                .map(champ => {
                  let name = champ.name;
                  name = name.replace(/ ?Doom Bot ?/gi, '');
                  if (/Nunu *(?:&|y) *Willump/i.test(name)) {
                    name = 'Nunu';
                  }
                  return { ...champ, name: name.trim() };
                });
              const champObj = champName ? normalizedChampList.find(c => c.name === champName) : null;
              return champName && champObj ? (
                <div key={i} className={`team-slot filled`} onClick={() => onRemove(champName)} style={{cursor:'pointer'}} title="Eliminar">
                  <img src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champObj.id}.png`} alt={champName} className="champ-icon-team" />
                </div>
              ) : (
                <div key={i} className={`team-slot`}></div>
              );
            })}
          </div>
          {/* Pick recomendado separado */}
          <div className="recommended-pick-block" style={{marginTop:'12px', textAlign:'center'}}>
            <div style={{fontWeight:'bold', color:'#7ecfff', marginBottom:'4px'}}>Tu pick recomendado</div>
            {(() => {
              const champName = selected[4];
              const normalizedChampList = championList
                .filter(champ => champ.name.toLowerCase() !== 'none')
                .filter(champ => !role || (champ.roles && champ.roles.includes(role)))
                .map(champ => {
                  let name = champ.name;
                  name = name.replace(/ ?Doom Bot ?/gi, '');
                  if (/Nunu *(?:&|y) *Willump/i.test(name)) {
                    name = 'Nunu';
                  }
                  return { ...champ, name: name.trim() };
                });
              const champObj = champName ? normalizedChampList.find(c => c.name === champName) : null;
              return champName && champObj ? (
                <div className="recommended-pick-card" style={{display:'inline-block', border:'2px solid #7ecfff', borderRadius:'12px', padding:'8px 16px', background:'#1b274a'}}>
                  <img src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champObj.id}.png`} alt={champName} className="champ-icon-team" style={{width:'48px',height:'48px'}} />
                  <div className="champ-name" style={{fontSize:'1rem', color:'#e0e6f6', marginTop:'4px'}}>{champName}</div>
                </div>
              ) : (
                <div style={{color:'#e0e6f6', opacity:0.5}}>Sin pick recomendado</div>
              );
            })()}
          </div>
        </>
      ) : (
        <div className="team-list">
          {Array.from({ length: 5 }).map((_, i) => {
            const champName = selected[i];
            const normalizedChampList = championList
              .filter(champ => champ.name.toLowerCase() !== 'none')
              .map(champ => {
                let name = champ.name;
                name = name.replace(/ ?Doom Bot ?/gi, '');
                if (/Nunu *(?:&|y) *Willump/i.test(name)) {
                  name = 'Nunu';
                }
                return { ...champ, name: name.trim() };
              });
            const champObj = champName ? normalizedChampList.find(c => c.name === champName) : null;
            return champName && champObj ? (
              <div key={i} className={`team-slot filled`} onClick={() => onRemove(champName)} style={{cursor:'pointer'}} title="Eliminar">
                <img src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champObj.id}.png`} alt={champName} className="champ-icon-team" />
              </div>
            ) : (
              <div key={i} className={`team-slot`}></div>
            );
          })}
        </div>
      )}
      <div style={{width: '100%', display: 'flex', justifyContent: 'center', margin: '2px 0 0 0'}}>
        <div className="role-icons-filter" style={{display: 'flex', gap: '12px'}}>
          {roles.map(r => (
            <img
              key={r}
              src={roleIcons[r]}
              alt={roleNames[r]}
              className={`role-icon-filter${role === r ? ' active' : ''}`}
              onClick={() => setRole(role === r ? '' : r)}
            />
          ))}
        </div>
      </div>
      <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '0', marginTop: '8px'}}>
        <input
          type="text"
          className="champ-search-bar"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{width: '120px', padding: '4px 8px', fontSize: '0.95rem', borderRadius: '6px', border: 'none', background: '#1b274a', color: '#e0e6f6'}}
        />
      </div>
      <div className="champ-list champ-select-list" style={{margin: 0, padding: 0}}>
        {filteredChamps.map(champ => (
          <div
            key={champ.id}
            className={`champ champ-card ${selected.includes(champ.name) ? 'picked' : ''}`}
            onClick={() => onPick(champ.name)}
            title={champ.name}
            style={{margin: 0, padding: 0}}
          >
            <div className="champ-visual-block" style={{margin: 0, padding: 0}}>
              <img src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champ.id}.png`} alt={champ.name + ' icon'} className="champ-icon-team" style={{marginBottom: 0}} />
              <div className="champ-name" style={{marginBottom: 0}}>{champ.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChampionSelector;
