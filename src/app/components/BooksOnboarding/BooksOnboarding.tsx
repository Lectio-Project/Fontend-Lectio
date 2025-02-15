'use client';

import { BooksOnboardingProps } from '@/types/onboarding-types';
import { getCookie } from '@/utils/cookies';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Loading from '../Loading/loading';

import api from '@/api/api';

import { useDataContext } from '@/context/user';
import { BookProps } from '@/types/book';
import './BooksOnboarding.css';

export default function BooksOnboarding({
    selectedBooks,
    setSelectedBooks
}: BooksOnboardingProps) {
    const { onboardingBooks, setOnboardingBooks } = useDataContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isTablet = useMediaQuery('(min-width:768px)');
    const isDesktop = useMediaQuery('(min-width:1280px)');

    useEffect(() => {
        if (!onboardingBooks) {
            setIsLoading(true);
            listBooks();
        }
    }, []);

    const listBooks = async () => {
        try {
            const token = await getCookie('token');

            const response = await api.get('/books', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOnboardingBooks(response.data);
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookSelection = (
        e: React.MouseEvent<HTMLElement>,
        book: BookProps
    ) => {
        const isBookSelected = selectedBooks.includes(book);

        if (isBookSelected) {
            setSelectedBooks(
                selectedBooks.filter(
                    (selectedBook: BookProps) => selectedBook !== book
                )
            );
            e.currentTarget.classList.replace(
                'selected-book-list',
                'default-book-list'
            );
        } else if (selectedBooks.length < 3) {
            setSelectedBooks([...selectedBooks, book]);
            e.currentTarget.classList.replace(
                'default-book-list',
                'selected-book-list'
            );
        }
    };

    return !isLoading ? (
        isTablet ? (
            <Swiper
                className="onboarding-container-books"
                modules={[Navigation, Pagination]}
                slidesPerView={isDesktop ? 6 : isTablet && 4}
                slidesPerGroup={6}
                pagination={{ clickable: true }}
                navigation={isDesktop ? true : false}
            >
                {onboardingBooks?.map((book) => (
                    <SwiperSlide key={book.id}>
                        <section
                            className="default-book-list"
                            onClick={(e) => handleBookSelection(e, book)}
                        >
                            <img
                                src={book.imageUrl}
                                className="book-image-onboarding"
                            />
                            <span className="book-title-onboarding">
                                {book.name}
                            </span>
                            <span className="book-author-onboarding">
                                {book.AuthorBook![0].author.name}
                            </span>
                        </section>
                    </SwiperSlide>
                ))}
            </Swiper>
        ) : (
            <section className="onboarding-container-book-list">
                {onboardingBooks?.map((book) => (
                    <section
                        className="default-book-list"
                        onClick={(e) => handleBookSelection(e, book)}
                        key={book.id}
                    >
                        <img
                            src={book.imageUrl}
                            className="book-image-onboarding"
                        />
                        <span className="book-title-onboarding">
                            {book.name}
                        </span>
                        <span className="book-author-onboarding">
                            {book.AuthorBook![0].author.name}
                        </span>
                    </section>
                ))}
            </section>
        )
    ) : (
        <div className="onboarding-books-loading">
            <Loading />
        </div>
    );
}
