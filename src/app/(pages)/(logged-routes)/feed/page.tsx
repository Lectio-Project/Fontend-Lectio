'use client';

import Header from '@/app/components/Header/Header';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './feed.css';

import api from '@/api/api';
import BookFeed from '@/app/components/BookFeed/BookFeed';
import Loading from '@/app/components/Loading/loading';
import { useDataContext } from '@/context/user';
import { BookProps } from '@/types/book';
import { ResponseBooks } from '@/types/feedDatas';
import { useEffect, useState } from 'react';
import ConceicaoImg from '../../../assets/conceicaoevaristo.svg';
import DanielaImg from '../../../assets/danielaarbex.svg';
import MachadoImg from '../../../assets/machadodeassis.svg';
import ruthImg from '../../../assets/ruthrocha.svg';

export default function Feed() {
    const authorsHighlight = [
        {
            id: 1,
            name: 'Daniela Arbex',
            description:
                'Conheça mais sobre a jornalista que documenta eventos históricos e as vidas afetadas por essas tragédias.',
            img: DanielaImg
        },
        {
            id: 2,
            name: 'Conceição Evaristo',
            description:
                'Vencedora do Prêmio Jabuti e uma das figuras mais proeminentes da Literatura Brasileira, mergulhe nos mundos construídos por Conceição.',
            img: ConceicaoImg
        },
        {
            id: 3,
            name: 'Machado de Assis',
            description:
                'Um dos maiores autores clássicos da nossa literatura, veja Assis além das recomendações escolares.',
            img: MachadoImg
        },
        {
            id: 4,
            name: 'Ruth Rocha',
            description:
                'Com mais de 50 anos de carreira e uma vasta lista de produções de literatura infantil, Ruth fez parte da infância de inúmero brasileiros.',
            img: ruthImg
        }
    ];
    const { feedTopicsTitles, userData } = useDataContext();

    const [books, setBooks] = useState<ResponseBooks>({});

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getBooks() {
            try {
                setIsLoading(true);
                const response = await api.get(
                    '/search/categories?isMovie=true&bestRated=true&weekPopulater=true&literaryAwards=true&sexGenderAuthor=woman',
                    {
                        headers: {
                            Authorization: `Bearer ${userData.token}`
                        }
                    }
                );

                const { literaryAwards } = response.data;

                const literaryAwardJabuti: BookProps[] = literaryAwards.filter(
                    (bookAward: BookProps) => {
                        const jabutiAward = bookAward.LiteraryAwards?.some(
                            (book) => {
                                return (
                                    book.name.includes('Jabuti') ||
                                    book.name.includes('jabuti')
                                );
                            }
                        );

                        return jabutiAward && bookAward;
                    }
                );

                const booksFound = {
                    ...response.data,
                    literaryAwards: literaryAwardJabuti
                };

                setBooks(booksFound);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        }

        getBooks();
    }, []);

    return (
        <div className='container-feed'>
            <Header search="able" select="feed" />
            <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
            >
                {authorsHighlight.map((author) => (
                    <SwiperSlide key={author.id}>
                        <div className="container-slider">
                            <section
                                className="slider"
                                style={{
                                    backgroundImage: `url(${author.img})`
                                }}
                            >
                                <h1>{author.name}:</h1>
                                <p>{author.description}</p>
                            </section>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {isLoading ? (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '100px',
                        backgroundColor: '#121418',
                    }}
                >
                    <Loading />
                </div>
            ) : (
                Object.keys(feedTopicsTitles).map((key) => {
                    if (books[key])
                        return (
                            <BookFeed
                                title={feedTopicsTitles[key] as string}
                                books={books[key] as BookProps[]}
                                link={key}
                            />
                        );
                })
            )}
        </div>
    );
}
