const UserNames = ['Alfa', 'Bravo', 'Charlie', 'Delta'] as const;

type Client = {
	username: string;
	id: string;
};

function generateUsername(used?: Array<string | null>): string {
	let username: string = '';

	if (!used) {
		return UserNames[0];
	}

	for (let i = 0; i < UserNames.length; i++) {
		let exists = false;
		for (let j = 0; j < used.length; j++) {
			if (UserNames[i] === used[j]) {
				exists = true;
			}
		}
		if (!exists) {
			username = UserNames[i];
			break;
		}
	}

	return username;
}

export type { Client };
export { generateUsername };
