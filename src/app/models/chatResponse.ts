export interface chatResponse {
    text: any;
    timestamp: string | number | Date;
    message: string;
    chatId: string;
    sender?: string;
}

export interface ChatRoomsResponse {
    chatId: string;
    participants: string[];
    lastMessage: string;
    lastUpdated: Date;
    _id: string;
    __v?: number;
}

export interface MessageSentResponse {
    chatId: string;
    sender: string;
    text: string;
    timestamp: Date;
    _id: string;
    __v?: number;
}