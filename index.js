const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const pokemonSelect = document.getElementById('pokemonSelect');
const getPokeBtn = document.getElementById('pokeBtn');
const compareBtn = document.getElementById('compareBtn');
const pokeInfo = document.getElementById('pokeInfo');
let pokemons = [];
class Pokemon{
    constructor(name, image, types, weight, height, stats) {
        this.name = name;
        this.image = image;
        this.types = types;
        this.weight = weight;
        this.height = height;
        this.stats = stats;
    }
    compare(){}
}

const fetchPokeData = async() => {
    try{
        const res = await fetch(apiUrl);
        if(!res.ok) {
            throw new Error('Poke response NOT Ok');
        }
        const data = await res.json();
        const pokeList = data.results;
        await Promise.all(pokeList.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const pokeData = await res.json();
            const name = pokeData.name;
            const image = pokeData.sprites.front_default;
            const types = pokeData.types.map(type => type.type.name);
            const weight = pokeData.weight;
            const height = pokeData.height;
            const stats = {};
            pokeData.stats.forEach(stat => {
                stats[stat.stat.name] = stat.base_stat;
        });
        
        const newPokemon = new Pokemon(name, image, types, weight, height, stats);
        pokemons.push(newPokemon);
        const optionElement = document.createElement('option');
        optionElement.value = name;
        optionElement.textContent = name;
        pokemonSelect.appendChild(optionElement);    
        }));
    } catch(error){
        console.error('Error fetching Poke data', error);
    }
}

const renderPokeInfo = (pokemon) => {
    pokeInfo.innerHTML = `
    <h2>${pokemon.name}</h2>
    <img src="${pokemon.image}" alt="${pokemon.name}">
    <p>Types: ${pokemon.types.join(', ')}</p>
    <p>Weight: ${pokemon.weight}</p>
    <p>Height: ${pokemon.height}</p>
    <p>Stats: </p>
    <ul>
        ${Object.entries(pokemon.stats).map(([stat, value]) => 
        `<li>${stat}: ${value}</li>`).join('')}
        </ul>
        `;
}

pokemonSelect.addEventListener('change', (e) => {
    const selectedPokeName = e.target.value;
    const selectedPokemon = pokemons.find(pokemon => pokemon.name === selectedPokeName);
    if(selectedPokemon) {
        renderPokeInfo(selectedPokemon);
    }
});

getPokeBtn.addEventListener('click', () => {
    const selectedPokemonName = pokemonSelect.value;
    const selectedPokemon = pokemons.find(pokemon => pokemon.name === selectedPokemonName);
    if(selectedPokemon) {
        renderPokeInfo(selectedPokemon);
    }
});
    
fetchPokeData();