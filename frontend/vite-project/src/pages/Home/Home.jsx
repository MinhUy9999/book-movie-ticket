import { useSelector } from "react-redux";

const Home = () => {
    const { username, isAuthenticated } = useSelector((state) => state.user);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 text-center">
                {isAuthenticated ? (
                    <h1 className="text-2xl font-bold">Welcome to Home, {username}!</h1>
                ) : (
                    <h1 className="text-2xl font-bold">Welcome to Home! Please log in.</h1>
                )}
            </div>
        </div>
    );
};

export default Home;