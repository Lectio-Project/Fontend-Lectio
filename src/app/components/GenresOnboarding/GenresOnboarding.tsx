'use client'

import { Genre, GenresOnboarding } from '@/types/onboarding-types';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookies';

import api from '@/api/api';

import './GenresOnboarding.css';

export default function GenresOnboarding({ selectedGenres, setSelectedGenres }: GenresOnboarding) {
    const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        listGenres();
    }, []);

    const listGenres = async () => {
        try {
            const token = await getCookie('token');
            
            const response = await api.get('/genres', 
                { headers: {
                    Authorization: `Bearer ${token}`
                }});
            setGenres(response.data);
        } catch (error: any) {
            console.error(error)
        }
    }

    const handleGenreSelection = (e: React.MouseEvent<HTMLElement>, genre: Genre) => {
        const isGenreSelected = selectedGenres.includes(genre);
        
        if (isGenreSelected) {
            setSelectedGenres(selectedGenres.filter((selectedGenres: Genre) => selectedGenres !== genre));
            e.currentTarget.classList.replace('selected-genre-list', 'default-genre-list');
        } else if (selectedGenres.length < 3) {
            setSelectedGenres([...selectedGenres, genre]);
            e.currentTarget.classList.replace('default-genre-list', 'selected-genre-list');
        } else {
            alert('Você só pode selecionar no máximo 3 autores.');
        }
    }

    return (
        <section className='onboarding-container-button-list'>
            {genres.map((genre) => {
                return (
                    <section className='onboarding-button-list' key={genre.id}>
                        <button
                            type='button'
                            className='default-genre-list'
                            onClick={(e) => handleGenreSelection(e, genre)}
                            >
                            {genre.gender}
                        </button>
                    </section>
                );
            })}
        </section>
    )
}