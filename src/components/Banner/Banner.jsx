import BannerImage from "../../assets/banner.jpeg";
function Banner () {
 return(

    <div className="w-full h-[25rem] relative">

        <img src= {BannerImage}
        className="h-full w-full"
        />

        <div className="absolute top-20 mx-auto left-0 right-0 w-[20rem]">

            <div className="flex flex-col gap-4">

                <div className="font-semibold text-5xl text-white">
                    CryptoTracker
                </div>

                <div className="font-semibold text-am text-white text-center">
                    Get all info regarding cryptocurrencies
                </div>
            </div>
        </div>

        
    </div>
 )

}

export default Banner;