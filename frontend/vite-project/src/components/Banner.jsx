import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../index.css";

const movies = [
    {
        id: 1,
        title: "Avengers: Endgame",
        content: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        image: "https://image.tmdb.org/t/p/original/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
        trailer: "https://www.youtube.com/embed/TcMBFSGVi1c"
    },
    {
        id: 2,
        title: "Spider-Man: No Way Home",
        content: "With the help of his newfound ally, Peter Parker, the world's greatest superhero faces another threat: the enigmatic and powerful Joker. As the city unfolds in chaos, Peter must use his newfound abilities and wits to save Gotham City and bring about a new dawn.",
        image: "https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        trailer: "https://www.youtube.com/embed/JfVOs4VSpmA"
    },
    {
        id: 3,
        title: "The Batman",
        content: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
        image: "https://image.tmdb.org/t/p/original/74xTEgt7R36Fpooo50r9T25onhq.jpg",
        trailer: "https://www.youtube.com/embed/mqqft2x_Aa4"
    }
];

const Banner = () => {
    const [trailerUrl, setTrailerUrl] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openTrailer = (url) => {
        setTrailerUrl(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setTrailerUrl("");
        setIsModalOpen(false);
    };

    return (
        <div className="w-full h-[500px] relative">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop
                className="w-full h-full"
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.id} className="relative">
                        <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-10 left-10 bg-black bg-opacity-50 text-white p-4 rounded-lg max-w-[400px]">
                            <h2 className="text-2xl font-bold">{movie.title}</h2>
                            <p className="mt-2">{movie.content}</p>
                            <button
                                onClick={() => openTrailer(movie.trailer)}
                                className="mt-2 bg-red-600 px-4 py-2 rounded-full text-white hover:bg-red-800 transition"
                            >
                                Xem Trailer
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Modal Trailer */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 relative w-[90%] max-w-2xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-3xl"
                        >
                            &times;
                        </button>
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe
                                className="w-full h-[315px] md:h-[400px]"
                                src={trailerUrl}
                                title="Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Banner;
