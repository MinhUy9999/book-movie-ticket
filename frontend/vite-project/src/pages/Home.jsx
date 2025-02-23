import Banner from "../components/Banner"
import MoviesShowing from "../components/MoviesShowing"


const Home = () => {
    return (
        <div>
            <Banner />
            <div className="container mx-auto py-10">
                <h1 className="text-4xl font-bold text-center mb-8">🎬 Phim Đang Chiếu</h1>
                <MoviesShowing />
            </div>
        </div>
    )
}

export default Home
// import { useState, useEffect } from 'react';

// function App() {
//     const [movies, setMovies] = useState([]);

//     useEffect(() => {
//         fetch('http://localhost:3000/api/movies') // Gọi API lấy danh sách phim
//             .then((res) => res.json())
//             .then((data) => setMovies(data))
//             .catch((err) => console.error('Lỗi khi tải phim:', err));
//     }, []);

//     return (
//         <div>
//             <h1>Danh sách phim</h1>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
//                 {movies.map((movie) => (
//                     <div key={movie._id} style={{ border: '1px solid #ddd', padding: '10px', width: '300px' }}>
//                         <img src={`http://localhost:3000/${movie.poster}`} alt={movie.title} style={{ width: '100%' }} />
//                         <h3>{movie.title}</h3>
//                         <p><b>Đạo diễn:</b> {movie.director}</p>
//                         <p><b>Thể loại:</b> {movie.genre.join(', ')}</p>
//                         <p><b>Thời lượng:</b> {movie.duration} phút</p>
//                         <p><b>Ngày phát hành:</b> {new Date(movie.releaseDate).toLocaleDateString()}</p>
//                         <video width="100%" controls>
//                             <source src={`http://localhost:3000/${movie.video}`} type="video/mp4" />
//                             Trình duyệt của bạn không hỗ trợ video.
//                         </video>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default App;
