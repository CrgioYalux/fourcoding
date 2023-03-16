import { v4 } from 'uuid';
import { arrayToFixedLengthArray } from './FixedLengthArray';

import type { OperationResult } from './utils';
import type { FixedLengthArray } from './FixedLengthArray';

type Hosted<T> = T | null;

type Room<T extends number, K> = {
    participants: FixedLengthArray<Hosted<K>, T>,
    key?: string,
}

type Hotel<T extends number, K> = Map<string, Room<T, Hosted<K>>>;

class HotelManager<T extends number, K> {
    private hotel: Hotel<T, K>;
    private roomLength: number;

    constructor(roomLength: number) {
        this.hotel = new Map();
        this.roomLength = roomLength;
    }

    public joinRoom(roomID: string, participant: Hosted<K>, key?: string): OperationResult<Room<T, Hosted<K>>> {
        const room = this.hotel.get(roomID);

        if (!room) {
            return {
                error: true,
                msgs: ["Room not found"],
            };
        }

        if (room.key !== key) {
            return {
                error: true,
                msgs: [`Room key is incorrect`],
            };
        }
        
        const emptySpaceIdx = room.participants.findIndex((p) => p === null);

        if (emptySpaceIdx === -1) {
            return {
                error: true,
                msgs: [`Room is full (${this.roomLength}/${this.roomLength})`],
            };
        }
        
        room.participants[emptySpaceIdx] = participant;

        const updatedRoom: Room<T, Hosted<K>> = {
            participants: room.participants,
            key: key,
        };

        this.hotel.set(roomID, updatedRoom);

        return {
            error: false,
            msgs: [],
            out: room,
        };
    }

    public removeFromRoom(roomID: string, participantIdx: number): void {
        const room = this.hotel.get(roomID);

        if (room) {
            const participantsLeft = arrayToFixedLengthArray<Hosted<K>, T>(room.participants.map((p, idx) => idx === participantIdx ? null : p));

            const updatedRoom: Room<T, Hosted<K>> = {
                participants: participantsLeft,
                key: room.key,
            };

            this.hotel.set(roomID, updatedRoom);
        }
    }

    public checkRoom(roomID: string, key?: string): OperationResult<Room<T, Hosted<K>>> {
        const room = this.hotel.get(roomID);

        if (!room) {
            return {
                error: true,
                msgs: ["Room not found"],
            };
        }

        if ((room.key && !key) || (room.key && key && room.key !== key)) {
            return {
                error: true,
                msgs: [`Room key is incorrect`],
            };
        }

        return {
            error: false,
            msgs: [],
            out: room,
        };
    }

    public createRoom(creator: Hosted<K>, key?: string, limit?: number): string {
        const roomID: string = v4();

        const existantRoom = this.hotel.get(roomID);
        if (existantRoom) {
            return this.createRoom(creator, key, limit);
        }

        const participants = this.createHostedsArray();
        participants[0] = creator;

        const newRoom: Room<T, Hosted<K>> = {
            participants: participants,
            key: key,
        };

        this.hotel.set(roomID, newRoom);

        return roomID;
    }

    private createHostedsArray(): FixedLengthArray<Hosted<K>, T> {
        const arr = new Array<Hosted<K>>(this.roomLength).fill(null);

        return arrayToFixedLengthArray<Hosted<K>, T>(arr);
    }
}

export type { Room, Hosted };
export default HotelManager;
