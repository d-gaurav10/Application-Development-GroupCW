import BookCard from './BookCard';

function BookSection({ title }) {
  return (
    <section className="p-8 text-black">
      <h3 className="text-2xl mb-4 text-black">{title}</h3>
      <div className="flex gap-4 flex-wrap justify-start">
        {renderBooks()}
      </div>
    </section>
  );
}

function renderBooks() {
  const books = [
    { title: "It Ends With Us", author: "Colleen Hoover", img: "book1.png" },
    { title: "Norwegian Wood", author: "Haruki Murakami", img: "book2.png" },
    { title: "A Thousand Splendid Suns", author: "Khaled Hosseini", img: "book3.png" },
    { title: "No Longer Human", author: "Osamu Dazai", img: "book4.png" },
    { title: "It Ends With Us", author: "Colleen Hoover", img: "book1.png" },
    { title: "Norwegian Wood", author: "Haruki Murakami", img: "book2.png" },
    { title: "A Thousand Splendid Suns", author: "Khaled Hosseini", img: "book3.png" },
    { title: "No Longer Human", author: "Osamu Dazai", img: "book4.png" },
    { title: "It Ends With Us", author: "Colleen Hoover", img: "book1.png" },
    { title: "Norwegian Wood", author: "Haruki Murakami", img: "book2.png" },
  ];

  return books.map((book, index) => (
    <BookCard key={index} book={book} />
  ));
}

export default BookSection;
