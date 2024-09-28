import React from 'react';
import { FiUser, FiCalendar } from 'react-icons/fi';

// Dummy article data
const articles = [
  {
    id: 1,
    date: 'Apr 8, 2023',
    author: 'Maksym Ostrozhynskyy',
    title: 'Pink stairs leading to the sky',
    description: `In my opinion, UI/UX design is the foundation of a product, 
                  its face and soul. You can create an infinitely high-quality 
                  heart, and organize the simulation of breathing, but we won’t 
                  fall in love with a product just because its heart beats...`,
  },
  {
    id: 2,
    date: 'Apr 8, 2023',
    author: 'Mike Yukhtenko',
    title: 'Building on the corner of the sea',
    description: `Cognitive bias (also known as “cognitive illusion” or 
                  “cognitive distortion”) refers to errors in thinking that 
                  can lead to incorrect perception and decision-making...`,
  },
  {
    id: 3,
    date: 'Apr 8, 2023',
    author: 'Estúdio Bloom',
    title: 'The color of the sun for breakfast',
    description: `As is commonly believed, this methodology places the user 
                  at the center of the world and focuses on their views and 
                  habits. In fact, the product’s actual growth revolves around...`,
  },
];

const tags = ['UI/UX', 'Cognitive Science', 'Psychology', 'Product Design'];
const categories = ['Design', 'Psychology', 'Technology', 'Art'];

const Article = ({ date, author, title, description }) => {
  return (
    <div className="p-4 border-b border-gray-700 flex flex-col">
      <div className="flex items-center text-green-400 text-sm mb-2">
        <FiCalendar className="mr-1" />
        <span>{date}</span>
        <FiUser className="ml-4 mr-1" />
        <span>{author}</span>
      </div>
      <h2 className="text-xl font-semibold mb-2 text-green-500">{title}</h2>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="w-1/4 p-4 bg-black/20">
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2 text-green-400">Categories</h3>
        <ul>
          {categories.map((category, index) => (
            <li
              key={index}
              className="text-gray-300 hover:text-green-500 cursor-pointer"
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2 text-green-400">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-700 text-green-300 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2 text-green-400">Sort By</h3>
        <select className="w-full p-2 border border-gray-700 rounded bg-black text-gray-300">
          <option value="date">Date</option>
          <option value="author">Author</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>
  );
};

const ArticleList = () => {
  return (
    <div className="flex bg-black/20 min-h-[93vh] text-gray-300">
      <Sidebar />
      <div className=" max-w-md w-3/4 mx-auto bg-matte-black/50 shadow-md rounded-lg overflow-hidden">
        {articles.map((article) => (
          <Article
            key={article.id}
            date={article.date}
            author={article.author}
            title={article.title}
            description={article.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
