import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MentorResponse {
    tradeOffs: string;
    realWorldAnalogy: string;
    approach: string;
    betterAlternative: string;
}
export interface Challenge {
    id: string;
    difficulty: bigint;
    description: string;
    estimatedTime: bigint;
}
export interface backendInterface {
    addChallenge(id: string, description: string, difficulty: bigint, estimatedTime: bigint): Promise<void>;
    getAllChallenges(): Promise<Array<Challenge>>;
    getChallenge(id: string): Promise<Challenge>;
    storeMentorResponse(sessionId: string, response: MentorResponse): Promise<void>;
}
