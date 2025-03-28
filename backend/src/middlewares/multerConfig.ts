import multer from "multer";
import path from "path";
import fs from "fs-extra";
import { Request } from "express";

// Cấu hình nơi lưu trữ file
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        // Xác định thư mục lưu dựa trên loại file
        const folder = file.fieldname === "poster" ? "posters" : "trailers";
        const uploadDir = path.join(__dirname, "..", "uploads", folder);

        // Đảm bảo thư mục tồn tại
        fs.ensureDir(uploadDir)
            .then(() => cb(null, uploadDir))
            .catch((err) => cb(err, uploadDir));
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        // Tạo tên file duy nhất: timestamp + tên gốc file
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname); // Lấy phần mở rộng file
        const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
        cb(null, fileName);
    }
});

// Bộ lọc file để chỉ cho phép ảnh và video
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedImageTypes = /jpeg|jpg|png/;
    const allowedVideoTypes = /mp4|mov|avi/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (file.fieldname === "poster" && allowedImageTypes.test(extname) && allowedImageTypes.test(mimetype)) {
        cb(null, true); // Chấp nhận ảnh
    } else if (file.fieldname === "trailer" && allowedVideoTypes.test(extname) && allowedVideoTypes.test(mimetype)) {
        cb(null, true); // Chấp nhận video
    } else {
        cb(new Error("Invalid file type. Only images (jpg, png, jpeg) or videos (mp4, mov, avi) are allowed."));
    }
};

// Khởi tạo Multer middleware cho upload movie files
export const uploadMovieFiles = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // Giới hạn kích thước file: 10MB
    }
}).fields([
    { name: "poster", maxCount: 1 }, // Tối đa 1 file cho poster
    { name: "trailer", maxCount: 1 } // Tối đa 1 file cho trailer
]);