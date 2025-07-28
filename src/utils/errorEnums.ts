export enum ErrorMessage {
    // VALIDATION
    ERROR_VALIDATING_INPUT = 'Error validating input data',

    // User
    USER_NOT_FOUND = 'User not found',
    USERNAME_REQUIRED = 'Username is required',
    EMAIL_REQUIRED = 'Email is required',
    PASSWORD_REQUIRED = 'Password is required',
    DUPLICATED_USERNAME = 'Username has already been taken',
    DUPLICATED_EMAIL = 'Email has already been taken',
    INVALID_EMAIL_FORMAT = 'Email must be a valid Gmail address (e.g., example@gmail.com)',
    INVALID_PASSWORD_FORMAT = 'Password must be at least 8 characters and include both uppercase and lowercase letters',
    INVALID_GENDER_INPUT = 'Gender must be one of: male, female, other',
    INVALID_DOB_FORMAT = 'Date of birth must be in YYYY-MM-DD format',
    UNDER_AGE = 'You must be at least 13 years old to register',
    NOT_ALLOWED_PASSWORD_HERE = 'Password are not allowed to input in here',

    // Post
    POST_NOT_FOUND = 'Post not found',
    CONTENT_REQUIRED = 'Content is required for the post',
    INVALID_VISIBILITY_STATUS = 'Visibility status must be one of: public, private, friends',
    INVALID_REACTION_TYPE = 'Reaction type must be one of: like, love, haha, wow, sad, angry',
    INVALID_COMMENT_CONTENT = 'Comment content must be at least 1 character long',
    INVALID_REPLY_CONTENT = 'Reply content must be at least 1 character long',
    INVALID_FOLLOW_STATUS = 'Follow status must be one of: pending, accepted, canceled',
    INVALID_POST_ID = 'Post ID must be a valid UUID',
    INVALID_POST_ID_AND_CONTENT = 'Post and content is required',
    INVALID_POST_ID_AND_CONTENT_AND_COMMENT_ID = 'Post, content and comment id is required',
    FAILED_CREATE_POST = 'Failed to create post',
    FAILED_CREATE_SHARED_POST = 'Failed to create post',
    NO_PERMISSION_TO_ACCESS_POST = 'You do not have permission to access this post',

    // Comment
    COMMENT_NOT_FOUND = 'Comment not found',
    REPLY_NOT_FOUND = 'Reply not found',
    COMMENT_CONTENT_REQUIRED = 'Comment content is required',
    REPLY_CONTENT_REQUIRED = 'Reply content is required',
    PARENT_COMMENT_ID_REQUIRED = 'Parent comment ID is required for replies',
    COMMENT_ID_REQUIRED = 'Comment ID is required',
    FAILED_CREATE_COMMENT = 'Failed to create comment',
    FAILED_CREATE_REPLY = 'Failed to create reply',

    // Follow 
    FAILED_CREATE_FOLLOW = 'Failed to create follow',
    FAILED_UPDATE_FOLLOW = 'Failed to update follow',
    PENDING_FOLLOW_REQUEST = 'Your follow request is pending approval',
    FOLLOWED_USER_BEFORE = 'You was follow this user before',
    NOT_FOLLOW_USER = 'You are not following this user',

    // Notification
    RECIPIENT_NOT_FOUND = 'RECIPIENT_NOT_FOUND',
    RECIPIENT_ID_REQUIRED = 'Recipient ID is required',
    SENDER_ID_REQUIRED = 'Sender ID is required',
    CONTENT_NOTIFICATION_REQUIRED = 'Content notification is required',
    NOTIFICATION_UPDATED = 'Updated notification successfully',
    NOTIFICATION_DELETED = 'Deleted notification successfully',
    FAILED_CREATE_NOTIFICATION = 'Failed to create notification',

    // Reaction 
    FAILED_CREATE_REACTION = 'Failed to create reaction',

    // Authentication
    INVALID_LOGIN_CREDENTIALS = 'Invalid email or password',
    ACCOUNT_LOCKED = 'Account is locked due to too many failed login attempts',
    ACCOUNT_NOT_FOUND = 'Account does not exist',
    REGISTER_ERROR = 'Error registering user',

    // OTP 
    INVALID_OR_EXPIRED_OTP = 'Invalid or Expired OTP',
    FAILED_SEND_OTP = 'Failed to send OTP',

    // Socket.io
    SOCKET_IO_NOT_FOUND = 'Socket IO instance not available'
};