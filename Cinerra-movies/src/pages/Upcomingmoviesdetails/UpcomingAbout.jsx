export default function UpcomingAbout({ upcoming }) {
  if (!upcoming) {
    return (
      <section className="py-5 px-2 mx-4 md:mx-20 border-b border-gray-300 bg-transparent w-full">
        <div className=" max-w-5xl">
          <p className="text-xl text-gray-600">Upcoming movie details not available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 px-2 mx-4 md:mx-20 bg-transparent w-full border-b border-gray-300 max-w-5xl ">
      <div className=" max-w-5xl">
        
        <h2 className="text-xl md:text-2xl font-bold mb-2 leading-tight text-gray-900 pb-3">
          About the movie
        </h2>
        
        <p className="text-base md:text-base leading-normal tracking-wide text-gray-700 font-normal">
          {upcoming.about}
        </p>
      </div>
    </section>
  );
}