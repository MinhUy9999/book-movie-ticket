import { useSelector } from "react-redux";

const AdminPage = () => {
    const { username, role } = useSelector((state) => state.user);

    if (role !== "admin") {
        return <div className="text-center mt-20">Bạn không có quyền truy cập trang này!</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 text-center">
                <h1 className="text-2xl font-bold">Admin Page</h1>
                <p>Chào mừng, {username}! Đây là trang quản trị.</p>
            </div>
        </div>
    );
};

export default AdminPage;