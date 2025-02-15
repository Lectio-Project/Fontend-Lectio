'use client';

import ArrowGray from '../../../../../assets/arrowBottom.svg';
import ArrowBlack from '../../../../../assets/arrowButton.svg';
import ArrowYellow from '../../../../../assets/arrowGoYellow.svg';

import ButtonViewMore from '@/app/components/ButtonViewMore/ButtonViewMore';
import Header from '@/app/components/Header/Header';
import Loading from '@/app/components/Loading/loading';
import ModalRate from '@/app/components/ModalRate/ModalRate';
import RatingStars from '@/app/components/RatingStars/RatingStars';

import api from '@/api/api';
import { useMediaQuery } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';

import Comment from '@/app/components/Comment/Comment';
import ContainerBookHome from '@/app/components/ContainerBookHome/ContainerBookHome';
import { useDataContext } from '@/context/user';
import { AuthorBookProps } from '@/types/author';
import { BookProps } from '@/types/book';
import { CommentProps } from '@/types/comment';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './book-details.css';

type BookDetailsProps = {
    params: { id: string };
};

export default function BookDetails({ params }: BookDetailsProps) {
    const [bookData, setBookData] = useState<BookProps>();
    const session = useSession();

    const [booksAuthorData, setBooksAuthorData] = useState([]);
    const [commentWithText, setCommentWithText] = useState<CommentProps[]>([]);
    const [lastAvalitionUser, setLastAvaliationUser] =
        useState<CommentProps | null>(null);
    const [addComment, setAddComment] = useState<number>(0);
    const [showDescription, setShowDescription] = useState(false);
    const [showInfoTechnical, setShowInfoTechnical] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isTablet = useMediaQuery(
        '(min-width: 768px) and (max-width: 1023px)'
    );
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const routeId = params.id;
    const router = useRouter();
    const { userData } = useDataContext();
    const initialImage =
        'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';

    useEffect(() => {
        handleBookData();
    }, [addComment, session]);

    async function handleBookData() {
        try {
            const responseBook = await api.get(`/books/${routeId}?add=comment`);

            const authorId = responseBook.data.AuthorBook[0].author.id;

            const responseAuthor = await api.get(
                `/authors/${authorId}?add=book`,
                {
                    headers: {
                        authorization: `Bearer ${session.data?.token}`
                    }
                }
            );

            setBookData(responseBook.data);

            const commentText = responseBook.data.Comment.filter(
                (comment: CommentProps) => comment.text
            );

            const lastAvaliationOfUser = responseBook.data.Comment.find(
                (comment: CommentProps) => comment.user.id === userData.id
            );

            setLastAvaliationUser(lastAvaliationOfUser);
            setCommentWithText(commentText);

            const { data } = responseAuthor;
            const booksAuthorMap = data.AuthorBook.map(
                (book: AuthorBookProps) => {
                    return book.book;
                }
            );

            setBooksAuthorData(booksAuthorMap);
        } catch (error: any) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleFindBook() {
        const bookName = bookData?.name;
        return bookName?.replaceAll(' ', '+');
    }

    interface ImageErrorEvent extends SyntheticEvent<HTMLImageElement, Event> {
        target: EventTarget & {
            src: string;
        };
    }

    function handleImageError(event: ImageErrorEvent) {
        event.target.src = initialImage;
    }

    return ( 
        <section className="container-book">
            <Header search="able" select="feed" />
    
        {isLoading || !bookData ? (
            <div className="container-book-loading">
                <Loading />
            </div>
        ) : (
            <main className="content-container-book">
                <div className="book-info-reduced">
                    <div className="book-title-author-mobile">
                        <h3 className="book-title">{bookData.name}</h3>
                        <span className="book-author">
                            por{' '}
                            <span>
                                {bookData.AuthorBook![0].author.name}
                            </span>
                        </span>
                    </div>

                    <img src={bookData.imageUrl} className="book-image" />

                    <div className="local-genres-area-mobile">
                        <span className="genre-title">Gênero</span>
                        <span className="genre-book">
                            {bookData.gender.gender}
                        </span>
                    </div>

                    <div className="book-review-mobile">
                        <div className="note-book">
                            <RatingStars
                                starsValues={bookData.avgGrade}
                                size="medium"
                                readOnly
                                bookValue={bookData.avgGrade}
                            />
                        </div>

                        <div className="assessments-and-reviews">
                            <span>{bookData.counterGrade} avaliações</span>
                            <span>·</span>
                            <span>
                                {commentWithText.length} comentários
                            </span>
                        </div>
                    </div>

                    <a
                        className="button-book"
                        href={`https://www.amazon.com.br/s?k=${handleFindBook()}`}
                    >
                        <span>Quero ler!</span>
                        <img src={ArrowBlack} alt="" />
                    </a>

                    <div className="rating-book">
                        <ModalRate
                            title={
                                lastAvalitionUser
                                    ? 'Reavalie a obra'
                                    : 'Avalie a obra'
                            }
                            bookId={routeId}
                            addComment={addComment}
                            setAddComment={setAddComment}
                            lastAvalitionUser={lastAvalitionUser!}
                            requisition="book"
                        />
                    </div>
                </div>

                <div className="book-info-large">
                    <div className="book-title-author-desktop">
                        <h3 className="book-title">{bookData.name}</h3>
                        <span className="book-author">
                            por{' '}
                            <span>
                                {bookData.AuthorBook![0].author.name}
                            </span>
                        </span>
                    </div>

                    <div className="book-review-desktop">
                        <div className="note-book">
                            <RatingStars
                                starsValues={bookData.avgGrade}
                                size={isTablet ? 'medium' : 'large'}
                                readOnly
                                bookValue={bookData.avgGrade}
                            />
                        </div>

                        <div className="assessments-and-reviews">
                            <span>{bookData.counterGrade} avaliações</span>
                            <span>·</span>
                            <span>
                                {bookData.Comment.length} comentários
                            </span>
                        </div>
                    </div>

                    <div className="local-genres-area-desktop">
                        <span className="genre-title">Gênero</span>
                        <span className="genre-book">
                            {bookData.gender.gender}
                        </span>
                    </div>

                    <div
                        className={
                            showDescription
                                ? 'book-description-open'
                                : 'book-description'
                        }
                    >
                        <p className="book-description-text">
                            {bookData.synopsis}
                        </p>
                    </div>

                    <div
                        className="book-description-button"
                        onClick={() => setShowDescription(!showDescription)}
                    >
                        <span>
                            {showDescription ? 'Minimizar' : 'Saiba mais'}
                        </span>
                        <img
                            className={
                                showDescription
                                    ? 'arrow-top-button'
                                    : 'arrow-bottom-button'
                            }
                            src={ArrowYellow}
                            alt=""
                        />
                    </div>

                    <button
                        className={
                            showInfoTechnical
                                ? 'button-informations-open'
                                : 'button-informations-close'
                        }
                    >
                        <div
                            className="button-informations-top"
                            onClick={() => setShowInfoTechnical(true)}
                        >
                            <strong>Informações técnicas</strong>
                            <img
                                src={ArrowGray}
                                alt="ícone para expandir o botão"
                                className={
                                    showInfoTechnical
                                        ? 'button-informations-arrowTop'
                                        : 'button-informations-arrowBottom'
                                }
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowInfoTechnical(
                                        !showInfoTechnical
                                    );
                                }}
                            />
                        </div>

                        {showInfoTechnical && (
                            <section className="button-informations">
                                <div className="button-informations-info">
                                    <h3>Ano de publicação</h3>
                                    <h3>Editora</h3>
                                    <h3>Prêmios literários</h3>
                                    <h3>Número de páginas</h3>
                                    <h3>ISBN</h3>
                                </div>

                                <div className="button-informations-info">
                                    <p>{bookData.publishYear}</p>
                                    <p>{bookData.publishingCompany}</p>
                                    <p>
                                        {bookData.LiteraryAwards?.length
                                            ? `Prêmio ${bookData.LiteraryAwards[0].name} (${bookData.LiteraryAwards[0].year})`
                                            : 'Nenhum'}
                                    </p>
                                    <p>{bookData.totalPages}</p>
                                    <p>{bookData.isbn13}</p>
                                </div>
                            </section>
                        )}
                    </button>

                    <section className="container-comments">
                        <h3 className="comments-title">Comentários</h3>
                        <span className="comments-published">
                            {commentWithText.length} comentários publicados
                        </span>
                        <section className="comments">
                            {commentWithText.slice(0, 3).map((comment) => (
                                <Comment key={comment.id} {...comment} />
                            ))}
                        </section>
                        <ButtonViewMore
                            className="button-more-comments"
                            title="Ver mais comentários"
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/feed/book-comments/${routeId}`
                                )
                            }
                        />
                    </section>

                    <section className="more-books-author">
                        <h3>Você também pode se interessar...</h3>
                        <span>
                            Livros também escritos por{' '}
                            {bookData.AuthorBook![0].author.name}:
                        </span>
                    </section>

                    <ContainerBookHome
                        books={booksAuthorData}
                        isTablet={isTablet}
                        isDesktop={isDesktop}
                    />
                </div>
            </main>
        )}
            </section>
    )
}
