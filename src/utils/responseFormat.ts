
export interface ApiResponse<T = any> {
    status: number,
    message?: string,
    data?: T;
}

/**
 * Format phản hồi API theo định dạng chuẩn
 * @param status HTTP status code (e.g., 200, 400, 500)
 * @param message Thông điệp mô tả (e.g., "Successful", "Error occurred")
 * @param data Dữ liệu trả về (optional)
 * @returns Object định dạng { status, message, data }
 */


export const formatResponse = <T>(status: number, message?: string, data?: T): ApiResponse<T> => {
    return {
        status,
        message,
        data
    }
}

