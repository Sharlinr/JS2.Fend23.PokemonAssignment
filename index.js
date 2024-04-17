const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
const pokemonSelect1 = document.getElementById('pokemonSelect1');
const pokemonSelect2 = document.getElementById('pokemonSelect2');
const getPokeBtn = document.getElementById('pokeBtn');
const compareBtn = document.getElementById('compareBtn');
const pokeInfo1 = document.getElementById('pokeInfo1');
const pokeInfo2 = document.getElementById('pokeInfo2');
const displayWinner = document.getElementById('displayWinner');

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
    compare(secondPokemon){
        let thisWins = 0;
        let scndWins = 0;
        let winsCategories = [];

        if (this.weight > secondPokemon.weight) {
            thisWins++;
            winsCategories.push('weight');
        } else if (this.weight < secondPokemon.weight) {
            scndWins++;
            winsCategories.push('weight');
        }

        if (this.height > secondPokemon.height) {
        thisWins++;
        winsCategories.push('height');
        } else if(this.height < secondPokemon.height) {
        scndWins++;
        winsCategories.push('height');
        }

        this.stats.forEach((stat, index) => {
            if (stat.value > secondPokemon.stats[index].value){
                thisWins++;
                winsCategories.push(stat.name);
            } else if (stat.value < secondPokemon.stats[index].value){
                scndWins++;
                winsCategories.push(stat.name);
            }
        });

        if (thisWins === 0 && scndWins === 0) {
            return null;
        }

        return {thisWins, scndWins, winsCategories};
    }
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
            const stats = pokeData.stats.map(stat => ({ name: stat.stat.name, value: stat.base_stat }));
        
        const newPokemon = new Pokemon(name, image, types, weight, height, stats);
        pokemons.push(newPokemon);

        const optionElement1 = document.createElement('option');
        optionElement1.value = name;
        optionElement1.textContent = name;

        const optionElement2 = document.createElement('option');
        optionElement2.value = name;
        optionElement2.textContent = name;

        pokemonSelect1.appendChild(optionElement1);
        pokemonSelect2.appendChild(optionElement2);    
    }));
    } catch(error){
        console.error('Error fetching Poke data', error);
    }
}

const renderPokeInfo = (pokemon, infoElement) => {
    infoElement.innerHTML = `
    <h2>${pokemon.name.toUpperCase()}</h2>
    <img src="${pokemon.image}" alt="${pokemon.name}">
    <p><strong>Types: </strong>${pokemon.types.join(', ')}</p>
    <p><strong>Weight: </strong>${pokemon.weight}</p>
    <p><strong>Height: </strong>${pokemon.height}</p>
    <p><strong>Stats: </strong></p>
    <ul>
    ${pokemon.stats.map(stat => `<li>${stat.name}: ${stat.value}</li>`).join('')}
    </ul>
        `;
}

const displayWins = (thisPoke, otherPoke) => {
    const { thisWins, scndWins, winsCategories } = thisPoke.compare(otherPoke);
    if (thisWins > scndWins) {
        const winMsg = `${thisPoke.name} wins ${thisWins} categories: ${winsCategories.join(', ')}.`;
        displayWinner.textContent = winMsg;
        pokeInfo1.classList.add('winner');
        pokeInfo2.classList.remove('winner');
    } else if (thisWins < scndWins) {
        const winMsg = `${otherPoke.name} wins ${scndWins} categories: ${winsCategories.join(', ')}.`;
        displayWinner.textContent = winMsg;
        pokeInfo2.classList.add('winner');
        pokeInfo1.classList.remove('winner');
    } else {
        displayWinner.textContent = 'It\'s a tie!';
        pokeInfo1.classList.remove('winner');
        pokeInfo2.classList.remove('winner');
    }
}

getPokeBtn.addEventListener('click', () => {
    const selectedPokemonName = pokemonSelect1.value;
    const selectedPokemon = pokemons.find(pokemon => pokemon.name === selectedPokemonName);
    if (selectedPokemon) {
        renderPokeInfo(selectedPokemon, pokeInfo1);
        pokeInfo2.innerHTML = '';
        displayWinner.textContent = '';
    }
});

compareBtn.addEventListener('click', () => {
    const selectedPokemonName1 = pokemonSelect1.value;
    const selectedPokemonName2 = pokemonSelect2.value;
    const selectedPokemon1 = pokemons.find(pokemon => pokemon.name === selectedPokemonName1);
    const selectedPokemon2 = pokemons.find(pokemon => pokemon.name === selectedPokemonName2);
    if (selectedPokemon1 && selectedPokemon2) {
        renderPokeInfo(selectedPokemon1, pokeInfo1);
        renderPokeInfo(selectedPokemon2, pokeInfo2);
        displayWins(selectedPokemon1, selectedPokemon2);
    }
});
    
fetchPokeData();