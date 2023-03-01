import { FixedLengthArray } from "./FixedLengthArray";

const UserNames = ["Alfa", "Bravo", "Charlie", "Delta"] as const;
type UserName = typeof UserNames[number];

type Client = {
    username: string,
    ip: string,
}

function generateUsername<T extends number>(used: FixedLengthArray<string | null, T>): string {
    let username: string = '';

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
export { };
