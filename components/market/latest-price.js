import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';

const LatestPrice = ({...props}) => {

    // useEffect(() => {
    //     const socket = io({
    //         query: {
    //           symbol: [BTC_USD]
    //         }
    //       });
    //     socket.on('api message', data => {
    //         console.log('api message =>', JSON.parse(data.message));
    //     })
    //     return () => {
    //         console.log('unmount, close socket');
    //         socket.close();
    //     };
    // })

    return (
        <div>
            LatestPrice
        </div>
    )
}

export default LatestPrice;