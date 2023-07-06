import type { User } from "@clerk/nextjs/dist/types/api";

export const filterUserForClient = (user: User) => {
	return {
		id: user.id,
		username: user.username,
		profileImageUrl: user.profileImageUrl,
		firstName: user.firstName,
	};
};
