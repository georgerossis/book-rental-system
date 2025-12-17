import mongoose from 'mongoose';
import Book from './models/Book';

const seedBooks = [
  {
    title: 'The Fellowship of the Ring',
    author: 'J. R. R. Tolkien',
    isbn: '9780261102354',
    description:
      'The first part of The Lord of the Rings, where Frodo begins his journey to destroy the One Ring.',
    genre: 'Fantasy',
    publishedYear: 1954,
    totalCopies: 5,
  },
  {
    title: 'The Two Towers',
    author: 'J. R. R. Tolkien',
    isbn: '9780261102361',
    description:
      'The second volume of The Lord of the Rings, following the breaking of the Fellowship.',
    genre: 'Fantasy',
    publishedYear: 1954,
    totalCopies: 5,
  },
  {
    title: 'The Return of the King',
    author: 'J. R. R. Tolkien',
    isbn: '9780261102378',
    description:
      'The final battle for Middle-earth and the conclusion of the quest to destroy the One Ring.',
    genre: 'Fantasy',
    publishedYear: 1955,
    totalCopies: 5,
  },
  {
    title: 'The Hobbit',
    author: 'J. R. R. Tolkien',
    isbn: '9780261102217',
    description:
      'Bilbo Baggins joins a company of dwarves on a quest to reclaim a lost mountain kingdom.',
    genre: 'Fantasy',
    publishedYear: 1937,
    totalCopies: 9,
  },
  {
    title: 'The Silmarillion',
    author: 'J. R. R. Tolkien',
    isbn: '9780618391110',
    description:
      'Mythic tales of the First Age of Middle-earth, from the creation of the world to great wars.',
    genre: 'Fantasy',
    publishedYear: 1977,
    totalCopies: 4,
  },
  {
    title: 'A Game of Thrones',
    author: 'George R. R. Martin',
    isbn: '9780553103540',
    description:
      'The first book in A Song of Ice and Fire, telling the story of noble houses vying for the Iron Throne.',
    genre: 'Fantasy',
    publishedYear: 1996,
    totalCopies: 7,
  },
  {
    title: 'A Clash of Kings',
    author: 'George R. R. Martin',
    isbn: '9780553108033',
    description:
      'The second book in A Song of Ice and Fire, as rival kings fight for control of Westeros.',
    genre: 'Fantasy',
    publishedYear: 1998,
    totalCopies: 7,
  },
  {
    title: 'A Storm of Swords',
    author: 'George R. R. Martin',
    isbn: '9780553106633',
    description:
      'Wars, betrayals and shocking twists as the battle for the Iron Throne intensifies.',
    genre: 'Fantasy',
    publishedYear: 2000,
    totalCopies: 7,
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J. K. Rowling',
    isbn: '9780747532699',
    description:
      'An orphan boy discovers he is a wizard and attends Hogwarts School of Witchcraft and Wizardry.',
    genre: 'Fantasy',
    publishedYear: 1997,
    totalCopies: 10,
  },
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J. K. Rowling',
    isbn: '9780747538493',
    description:
      'Harry returns to Hogwarts and uncovers the mystery of the Chamber of Secrets.',
    genre: 'Fantasy',
    publishedYear: 1998,
    totalCopies: 10,
  },
  {
    title: 'Harry Potter and the Prisoner of Azkaban',
    author: 'J. K. Rowling',
    isbn: '9780747542155',
    description:
      'A dangerous prisoner escapes from Azkaban and seems to be hunting Harry.',
    genre: 'Fantasy',
    publishedYear: 1999,
    totalCopies: 10,
  },
  {
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    isbn: '9780756405892',
    description:
      'Kvothe recounts his life story, from a traveling troupe to a legendary arcanist.',
    genre: 'Fantasy',
    publishedYear: 2007,
    totalCopies: 6,
  },
  {
    title: 'The Wise Man\'s Fear',
    author: 'Patrick Rothfuss',
    isbn: '9780756407124',
    description:
      'Kvothe continues his journey through the University, distant lands and dangerous encounters.',
    genre: 'Fantasy',
    publishedYear: 2011,
    totalCopies: 6,
  },
  {
    title: 'Mistborn: The Final Empire',
    author: 'Brandon Sanderson',
    isbn: '9780765311788',
    description:
      'A world of ash and mist, where a small crew plans to overthrow an immortal tyrant.',
    genre: 'Fantasy',
    publishedYear: 2006,
    totalCopies: 8,
  },
  {
    title: 'The Well of Ascension',
    author: 'Brandon Sanderson',
    isbn: '9780765316882',
    description:
      'After toppling the Lord Ruler, the crew must now learn how to rule an empire.',
    genre: 'Fantasy',
    publishedYear: 2007,
    totalCopies: 8,
  },
  {
    title: 'The Hero of Ages',
    author: 'Brandon Sanderson',
    isbn: '9780765316899',
    description:
      'As ash falls and mists close in, the final secrets of the Mistborn world are revealed.',
    genre: 'Fantasy',
    publishedYear: 2008,
    totalCopies: 8,
  },
  {
    title: 'The Way of Kings',
    author: 'Brandon Sanderson',
    isbn: '9780765326355',
    description:
      'Epic war, shattered oaths and strange storms on the world of Roshar.',
    genre: 'Fantasy',
    publishedYear: 2010,
    totalCopies: 5,
  },
  {
    title: 'Words of Radiance',
    author: 'Brandon Sanderson',
    isbn: '9780765326362',
    description:
      'The Knights Radiant begin to re-emerge as ancient enemies return.',
    genre: 'Fantasy',
    publishedYear: 2014,
    totalCopies: 5,
  },
  {
    title: 'Oathbringer',
    author: 'Brandon Sanderson',
    isbn: '9780765326379',
    description:
      'Dalinar strives to unite the world as the true enemy declares war.',
    genre: 'Fantasy',
    publishedYear: 2017,
    totalCopies: 5,
  },
  {
    title: 'The Lies of Locke Lamora',
    author: 'Scott Lynch',
    isbn: '9780553804676',
    description:
      'A band of con artists led by Locke Lamora pull heists in the city of Camorr.',
    genre: 'Fantasy',
    publishedYear: 2006,
    totalCopies: 5,
  },  
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/book-rental';

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Αν θέλεις να καθαρίζεις πρώτα τη συλλογή:
    // await Book.deleteMany({});

    await Book.insertMany(seedBooks);
    console.log(`Inserted ${seedBooks.length} books.`);
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
