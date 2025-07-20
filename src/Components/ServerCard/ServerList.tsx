import axios from "axios";
import { useEffect, useState } from "react";
import ServerCard from "../ServerList/ServerCard";
import '../../index.css';
import type { ServerListState } from "../../types/ServerListState";



export default function ServerList() {
    const [state, setState] = useState<ServerListState>({
        servers: [],
        displayedServers: [],
        refresh: false,
        err: false,
        errData: "Unknown Error Has Happened",
        filterActive: false,
        sortLatest: false,
    });

    useEffect(() => {
        async function fetchServers() {
            try {
                const result = await axios.get("http://localhost:5200/api/servers");
                setState((prevState) => ({ ...prevState, servers: result.data }));
            } catch (error: any) {
                console.log(error)
                setState((prevState) => ({ ...prevState, err: true, errData: error.message }));
            }
        }
        fetchServers();
    }, [state.refresh]);

    useEffect(() => {
        function applyFilters() {
            let tempServersArr = [...state.servers];
            if (state.filterActive) {
                tempServersArr = tempServersArr.filter(server => server.is_active);
            }

            if (state.sortLatest) {
                tempServersArr = tempServersArr.sort((a, b) => new Date(b.creation).getTime() - new Date(a.creation).getTime());
            }
            setState((prevState) => ({ ...prevState, displayedServers: tempServersArr }));
        }
        applyFilters();
    }, [state.filterActive, state.sortLatest, state.servers]);


    return (
        <div className="serverList">
            <h1>Server Admin</h1>
            {state.err && <div className="err">{state.errData}</div>}
            <div className="sortBox">
                <div>
                    <input id="sortLatest" type="checkBox" checked={state.sortLatest}
                        onChange={(e) => {
                            const target = e.target as HTMLInputElement;
                            setState((prevState) => ({ ...prevState, sortLatest: target.checked }));
                        }} />
                    <label htmlFor="sortLatest">Sort Servers by Date (newest first)</label>
                </div>
                <div>
                    <input id="filterActive" type="checkBox" checked={state.filterActive}
                        onChange={(e) => {
                            const target = e.target as HTMLInputElement;
                            setState((prevState) => ({ ...prevState, filterActive: target.checked }));
                        }} />
                    <label htmlFor="filterActive">Filter active servers only</label>
                </div>
            </div>
            <div className="CardsBox">
                {state.displayedServers.map((server) => (
                    <ServerCard creation={server.creation} host_name={server.host_name} id={server.id}
                        ip={server.ip} is_active={server.is_active} name={server.name} key={server.id} setState={setState} />))}
            </div>
        </div>
    )
}

