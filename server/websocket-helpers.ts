type BroadcastFunction = (userId: number, message: any) => void;

interface WebSocketHelpers {
  broadcastToUser: BroadcastFunction | null;
}

export const wsHelpers: WebSocketHelpers = {
  broadcastToUser: null,
};

export function setBroadcastFunction(fn: BroadcastFunction) {
  wsHelpers.broadcastToUser = fn;
}
