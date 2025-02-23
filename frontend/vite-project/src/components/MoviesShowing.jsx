import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../App.css"; // Import file CSS

const nowPlayingMovies = [
    {
        id: 1,
        title: "Solo Leveling 1",
        image: "https://cdn.animevietsub.bio/data/poster/2024/01/06/animevsub-hFzXC2v51y.png",
    },
    {
        id: 2,
        title: "7 viên ngọc rồng: Daima",
        image: "https://cdn.animevietsub.bio/data/poster/2024/10/12/animevsub-MoHnX5yICN.jpg",
    },
    {
        id: 3,
        title: "Solo Leveling 2",
        image: "https://cdn.animevietsub.bio/data/poster/2025/01/12/animevsub-WCb7oRq8C9.jpg",
    },
    {
        id: 4,
        title: "Sát thủ về hưu",
        image: "https://cdn.animevietsub.bio/data/poster/2024/11/30/animevsub-CtX16cXVvh.jpg",
    },
    {
        id: 5,
        title: "Mục thần ký",
        image: "https://cdn.animevietsub.bio/data/poster/2024/11/05/animevsub-RV6938nN4D.jpg",
    },
];

const MoviesShowing = () => {
    return (
        <div className="w-full h-screen">
            <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{ delay: 3000 }}
                loop
                spaceBetween={10}
                breakpoints={{
                    320: { slidesPerView: 1, direction: "vertical" },
                    768: { slidesPerView: 3, direction: "horizontal" },
                    1024: { slidesPerView: 5, direction: "horizontal" },
                }}
                className="w-full flex justify-center h-[500px] md:h-auto"
            >
                {nowPlayingMovies.map((movie) => (
                    <SwiperSlide key={movie.id} className="flex items-center justify-center">
                        <div
                            className="relative w-full h-full md:w-[220px] md:h-[330px] group cursor-pointer"
                        >
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Overlay */}
                            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white p-4 text-center">
                                <h2 className="text-lg font-bold">{movie.title}</h2>
                            </div>
                            {/* Hiệu ứng hover */}
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                <button className="bg-red-500 px-4 py-2 rounded-lg text-white mb-2 hover:bg-red-600">
                                    Mua vé
                                </button>
                                <button className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default MoviesShowing;
