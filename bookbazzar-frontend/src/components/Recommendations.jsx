export default function Recommendations() {
  const recommendedBooks = [
    { img: "https://m.media-amazon.com/images/I/71UwSHSZRnS.jpg" },
    { img: "https://m.media-amazon.com/images/I/81gepf1eMqL.jpg" },
    { img: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg" },
    { img: "https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg" },
  ];

  const popularBooks = [
    { img: "https://m.media-amazon.com/images/I/718r6jzGllL.jpg" },
    { img: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg" },
    { img: "https://m.media-amazon.com/images/I/61Iz2yy2CKL.jpg" },
    { img: "https://m.media-amazon.com/images/I/81vpsIs58WL.jpg" },
  ];

  const books = Array(3).fill({
    title: "Book Title– Book name",
    author: "Author name",
    price: "Rs. 100",
    stock: "Stock: 5 remaining",
    img: "https://m.media-amazon.com/images/I/41u+U87kIEL._SY445_SX342_.jpg",
  });

  return (
    <section className="py-10 space-y-8">
      {/* Recommendations Row */}
      <div className="flex flex-col md:flex-row gap-6 bg-gray-300 p-6 rounded-xl">
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold">Recommended For You</h3>
          <p className="text-sm text-gray-700">
            Loremsodkasjdj kjashduihauikshjduid haukdhui ahsuidh dauishdui hauishd
            iuahsuid hiaushdui hauihsduia
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {recommendedBooks.map((book, i) => (
              <img
                key={i}
                src={book.img}
                alt="Recommended Book"
                className="w-20 h-28 object-cover rounded shadow"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold">Popular in 2020</h3>
          <p className="text-sm text-gray-700">
            Loremsodkasjdj kjashduihauikshjduid haukdhui ahsuidh dauishdui hauishd
            iuahsuid hiaushdui hauihsduia
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {popularBooks.map((book, i) => (
              <img
                key={i}
                src={book.img}
                alt="Popular Book"
                className="w-20 h-28 object-cover rounded shadow"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top Seller Row */}
      <div className="space-y-4">
        <h4 className="font-semibold text-black text-lg">Top Seller</h4>
        <div className="flex flex-wrap gap-6">
          {books.map((book, i) => (
            <div key={i} className="bg-gray-300 p-4 rounded-xl max-w-[250px]">
              <div className="bg-yellow-200 rounded-lg p-4">
                <img src={book.img} alt={book.title} className="w-full h-48 object-cover rounded" />
              </div>
              <div className="mt-4">
                <h5 className="font-bold text-black">{book.title}</h5>
                <p className="text-sm text-gray-700">{book.author}</p>
                <div className="flex justify-between text-sm text-black mt-2">
                  <span>{book.price}</span>
                  <span>{book.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
