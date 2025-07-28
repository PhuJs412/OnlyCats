export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FOLLOWER_ONLY = 'follower_only'
}

export enum ReactionType {
  LIKE = 'like',
  HAHA = 'haha',
  LOVE = 'love',
  SAD = 'sad',
  ANGRY = 'angry',
  WOW = 'wow',
  CARE = 'care',
}

export enum FollowStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELED',
}

export enum NotificationType {
  NEW_POST = 'NEW_POST',
  NEW_SHARED_POST = 'NEW_SHARED_POST',

  NEW_FOLLOW = 'NEW_FOLLOW',
  FOLLOW_REQUEST = 'FOLLOW_REQUEST',
  FOLLOW_ACCEPTED = 'FOLLOW_ACCEPTED',

  COMMENT = 'COMMENT',
  REPLY = 'REPLY',

  REACTION_POST = 'REACTION_POST',
  REACTION_COMMENT = `REACTION_COMMENT`
}
