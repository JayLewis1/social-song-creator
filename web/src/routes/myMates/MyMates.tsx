import React from 'react'
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT } from "../../graphql/queries";
// Components
import Mates from "../../components/mates/lists/Mates"
import SearchMates from "../../components/mates/lists/SearchMates";

const MyMates: React.FC = () => {
    const { data, loading } = useQuery(MY_ACCOUNT);
    if(loading) {
        return <div>loading...</div>
    }
    return (
        <div className="component-container">
            <SearchMates/>
            <ul className="mates-list">
                <Mates userId={!loading && data && data.me && data.me.id} />
            </ul>
        </div>    
            );
}

export default MyMates;