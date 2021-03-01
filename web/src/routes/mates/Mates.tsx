import React from 'react'
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT } from "../../graphql/queries";
// Components
import MatesComponent from "../../components/mates/MatesComponent"
import MatesSearch from "../../components/mates/MatesSearch";

interface RouteState {}

const Mates = () => {
    const { data, loading } = useQuery(MY_ACCOUNT);
    if(loading) {
        return <div>loading...</div>
    }
    return (
        <div className="component-container">
            <MatesSearch userId={!loading && data && data.me && data.me.id} />
            <ul className="mates-list">
                <MatesComponent userId={!loading && data && data.me && data.me.id} />
            </ul>
        </div>    
            );
}

export default Mates;