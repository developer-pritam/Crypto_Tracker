import { useContext, useState, useEffect } from 'react';
import { fetchCoinData } from '../../services/fetchCoinsData';
import { useQuery } from 'react-query';
import { currencyContext } from '../../context/currencyContext';

function CoinTable() {
  const { currency } = useContext(currencyContext);
  const [page, setPage] = useState(1);
  const [errorTimeout, setErrorTimeout] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data, isLoading, isError, error } = useQuery(
    ['coins', page, currency],
    () => fetchCoinData(page, currency),
    {
      cacheTime: 1000 * 60 * 2,
      keepPreviousData: true,
    },
  );

  const [coinData, setCoinData] = useState([]);

  useEffect(() => {
    if (data) {
      setCoinData((prevData) => [...prevData, ...data]);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      console.log('error', isError, error.message);
      setErrorTimeout(Date.now());
    }
  }, [isError, error]);

  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      if (Date.now() - errorTimeout < 3000) {
        return;
      }
      console.log('scrolling', isError, isLoading, loading);
      if (isLoading || isError || loading) return; // Prevent new requests if loading or error state

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setLoading(true);
        // timeoutId = setTimeout(() => {
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
        // }, 1000); // 1 second delay
      } else {
        clearTimeout(timeoutId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isLoading, isError, loading, errorTimeout]);

  // Load the first page data on component mount
  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    if (isError) {
      alert(`Error: ${error.message}`);
    }
  }, [isError, error]);

  return (
    <>
      <div className="my-5 flex flex-col items-center justify-center gap-5 w-[80vw] mx-auto">
        <div className="w-full bg-yellow-400 text-black flex py-4 px-2 font-semibold items-center justify-center">
          {/* Header of the table */}
          <div className="basis-[35%]">Coin</div>
          <div className="basis-[25%]">Price</div>
          <div className="basis-[20%]">24h change</div>
          <div className="basis-[20%]">Market Cap</div>
        </div>

        <div className="flex flex-col w-[80vw] mx-auto">
          {coinData &&
            coinData.map((coin) => {
              return (
                <div
                  key={coin.id}
                  className="w-full bg-transparent text-white flex py-4 px-2 font-semibold items-center justify-between cursor-pointer">
                  <div className="flex items-center justify-start gap-3 basis-[35%]">
                    <div className="w-[5rem] h-[5rem]">
                      <img
                        src={coin.image}
                        className="w-full h-full"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex flex-col">
                      <div className="text-3xl">{coin.name}</div>
                      <div className="text-xl">{coin.symbol}</div>
                    </div>
                  </div>

                  <div className="basis-[25%]">{coin.current_price}</div>
                  <div className="basis-[20%]">{coin.price_change_24h}</div>
                  <div className="basis-[20%]">{coin.market_cap}</div>
                </div>
              );
            })}
          {loading && <div className="loading-icon">Loading...</div>}
          {isError && <div>Error fetching data {isError}</div>}
        </div>
      </div>
    </>
  );
}

export default CoinTable;
