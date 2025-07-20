import axios from "axios";
import type { Server } from "../../types/Server"
import type { ServerListState } from "../../types/ServerListState";

interface ServerCardProps extends Server {
    setState: React.Dispatch<React.SetStateAction<any>>
}

function pad(date: number) {
    return date > 9 ? date : `0${date}`
}
export default function ServerCard(server: ServerCardProps) {
    async function toggleServerStatus() {
        const newStatus = server.is_active === 0 ? 1 : 0;
        try {
            const result = await axios.post("https://servers-server-adds.onrender.com/api/server/status", { id:server.id, is_active:newStatus});
            if (result.data.changedRows){
                server.setState((prevState:ServerListState) => ({ ...prevState, err:false, refresh:!prevState.refresh }));
            }
        } catch (error: any) {
            console.log(error)
            const data = error.response?.data;
            const msg =
                data && typeof data === "object"
                    ? Object.entries(data)
                        .map(([_key, val]) => `${val}`)
                        .join(", ")
                    : error.message;
            server.setState((prevState: ServerListState) => ({ ...prevState, err: true, errData: msg }));
        }
    }

    const creationDate = new Date(server.creation);
    return (
        <div className="serverCard">
            <h3>Server- {server.name}</h3>
            <div className="cardHeader">
                <div>Id: {server.id}</div>
                <div className="toggleBox">
                    <span>{server.is_active ?"online":"offline"}</span>
                    <div className={server.is_active ? "toggleWrapper activeTgl" : "toggleWrapper"} onClick={toggleServerStatus}>
                        <div className="toggleBtn">| | |</div>
                    </div>
                </div>
            </div>
            <div className="serverData">
                <div>Host: {server.host_name}</div>
                <div>Creation Date: {`${pad(creationDate.getDate())}/${pad(creationDate.getMonth() + 1)}/${creationDate.getFullYear()} - ${pad(creationDate.getHours())}:${pad(creationDate.getMinutes())}`}</div>
                <div>IP: {server.ip}</div>
            </div>
        </div>
    )
}

