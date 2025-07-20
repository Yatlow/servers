import type { Server } from "./Server";

export type ServerListState = {
    servers: Server[],
    displayedServers:Server[],
    refresh: boolean;
    err: boolean;
    errData: string;
    sortLatest:boolean;
    filterActive:boolean;
}