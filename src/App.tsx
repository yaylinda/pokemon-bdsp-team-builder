import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import produce from 'immer';
import React, { useEffect, useMemo, useState } from 'react';
import PokemonInputSection from './pokemonInputSection/PokemonInputSection';
import PokemonTeamResultsSection from './pokemonTeamResultsSection/PokemonTeamResultsSection';
import { Pokemon, PokemonMove, PokemonNameMap, PokemonTeamEvaluationResults, SelectedPokemon } from './types';
import { evaluateTeam, initializePokemonTeamEvaluationResults } from './util';

function App() {

    /**
     * 
     */
    const [pokemonTeam, setPokemonTeam] = useState<(SelectedPokemon | null)[]>([null, null, null, null, null, null]);

    /**
     * 
     */
    const [results, setResults] = useState<PokemonTeamEvaluationResults>(initializePokemonTeamEvaluationResults());

    /**
     * 
     */
    const pokemonMapByName: PokemonNameMap = useMemo(
        () => pokemonTeam
            .filter(pokemon => pokemon !== null)
            .reduce((prev, pokemon) => ({
                ...prev,
                [pokemon!.name]: pokemon,
            }), {}), [pokemonTeam]);

    /**
     * 
     */
    useEffect(() => {
        setResults(evaluateTeam(pokemonTeam.filter(pokemon => pokemon !== null) as SelectedPokemon[]));
    }, [pokemonTeam]);

    /**
     * 
     * @param index 
     * @param pokemon 
     */
    const onChangeSelectedPokemon = (index: number, pokemon: Pokemon | null) => {
        setPokemonTeam(produce(pokemonTeam, (draft) => {
            if (pokemon === null) {
                draft[index] = null;
            } else {
                draft[index] = {
                    ...pokemon,
                    selectedMoves: [null, null, null, null],
                };
            }
        }));
    }

    /**
     * 
     * @param pokemonIndex 
     * @param moveIndex 
     * @param move 
     */
    const onChangeSelectedPokemonMove = (pokemonIndex: number, moveIndex: number, move: PokemonMove | null) => {
        setPokemonTeam(produce(pokemonTeam, (draft) => {
            const pokemonToUpdate = draft[pokemonIndex];
            if (pokemonToUpdate === null) {
                return;
            }

            pokemonToUpdate.selectedMoves[moveIndex] = move;
        }));
    }

    /**
     * 
     * @returns 
     */
    const renderHeaderBar = () => {
        return (
            <AppBar position="static">
                <Toolbar sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Avatar src={`${process.env.PUBLIC_URL}/pokeball.png`} sx={{ backgroundColor: 'white', marginRight: 2 }}/>
                    <Typography variant="h6" component="div">
                        Pokemon Brilliant Diamond and Shining Pearl Team Builder
                    </Typography>
                    <Avatar src={`${process.env.PUBLIC_URL}/pokeball.png`} sx={{ backgroundColor: 'white', marginLeft: 2 }}/>
                </Toolbar>
            </AppBar>
        );
    }

    /**
     * 
     */
    return (
        <React.Fragment>

            {renderHeaderBar()}

            <Container>

                <PokemonInputSection
                    pokemonTeam={pokemonTeam}
                    onChangeSelectedPokemon={onChangeSelectedPokemon}
                    onChangeSelectedPokemonMove={onChangeSelectedPokemonMove}
                />

                <Divider>
                    <Chip label="RESULTS" color="primary" variant="outlined" />
                </Divider>

                <PokemonTeamResultsSection
                    results={results}
                    pokemonNameMap={pokemonMapByName}
                />

            </Container>

        </React.Fragment>
    );
}

export default App;
