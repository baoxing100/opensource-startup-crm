interface UserCreateInput {
    email: string;
    name: string;
    password: string;
    user_id: string;
    session_id: string;
    isActive: boolean;
    lastLogin: Date;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpiry?: Date;
}

interface UserUpdateInput {
    session_id?: string;
    lastLogin?: Date;
    password?: string;
    emailVerificationToken?: string | null;
    emailVerificationExpiry?: Date | null;
    isEmailVerified?: boolean;
}

interface UserWhereInput {
    email?: string;
    id?: string;
    emailVerificationToken?: string;
    emailVerificationExpiry?: {
        gt: Date;
    };
    isEmailVerified?: boolean;
}

export type { UserCreateInput, UserUpdateInput, UserWhereInput };
