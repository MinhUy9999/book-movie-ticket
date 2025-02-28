export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Kiểm tra số điện thoại: chỉ chứa số, ít nhất 10 số
export function isValidPhoneNumber(phone: string): boolean {
    return /^[0-9]{10,}$/.test(phone);
}

// Kiểm tra mật khẩu: ít nhất 8 ký tự, có ít nhất 1 chữ cái và 1 số
export function isValidPassword(password: string): boolean {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

// Kiểm tra ngày sinh có đúng định dạng dd/mm/yyyy không
export function isValidDateOfBirth(dob: string): boolean {
    return /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dob);
}
