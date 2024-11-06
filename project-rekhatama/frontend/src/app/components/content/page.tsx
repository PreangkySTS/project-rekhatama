import Image from 'next/image';

const Content = () => {
    return (
<>
<div className="container grid grid-cols-1 sm:grid-cols-2 lg:flex gap-5 justify-center mt-[6rem] overflow-x-auto">
  {/* CARD pertama */}
{/* CARD OI CARD JANGAN NGE BLANG CARD NU DI SEBELAH KIRI INI CUY AWAS */}
{/* BUNGKUS CARD NA CUY */}
  <div className="min-w-[300px] lg:w-[30rem] sm:w-[22rem]  w-full bg-[#dddcda] rounded mt-5 shadow-xl">
     {/*BUNGKUS IMAGE CUY  */}
    <div className="flex justify-center">
      <img className="  rounded-t-lg w-full h-auto sm:w-[25rem] sm:h-[25rem] mt-[4rem] drop-shadow-2xl" src="/images/2.png" alt="" />
    </div>
    
    {/* BUNGKUS BUAT HEADING TITLE MA TITLE CUY */}
    <div className="p-5 text-center">
      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          HEADING TITLE
        </h5>
      </a>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
PARAGRAF.
      </p>
      <a
        href="#"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-800 rounded-lg hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Read more
        <svg
          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </a>
    </div>
  </div>

  {/* CARD kedua */}
  <div className="min-w-[300px] lg:w-[30rem] sm:w-[22rem] w-full bg-[#dddcda] rounded mt-5 ">  
    <div className="flex justify-center">
      <img className="  rounded-t-lg w-[25rem] h-[25rem] mt-[4rem] md:h-[25rem]  drop-shadow-2xl z-10" src="/images/1.png" alt="" />
    </div>
    <div className="p-5 text-center">
      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          HEADING TITLE
        </h5>
      </a>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
PARAGRAF
      </p>
      <a
        href="#"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-800 rounded-lg hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Read more
        <svg
          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </a>
    </div>
  </div>
</div>
</>
    )
}

export default Content;