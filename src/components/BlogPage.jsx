import React, { useState } from 'react';
import { Clock, Tag, Search, ChevronRight } from 'lucide-react';
import Nav from './Nav';
import Footer from './Footer';

const blogPosts = [
  {
    id: 1,
    title: 'Bitcoin Reaches New All-Time High: What Investors Need to Know',
    excerpt: 'Bitcoin has surpassed its previous record, breaking through $84,000. Experts weigh in on the potential implications for the cryptocurrency market.',
    author: 'Sarah Thompson',
    date: 'April 15, 2024',
    readTime: '5 min read',
    tags: ['Bitcoin', 'Market Analysis'],
    image: '../../public/Blog1.jpeg'
  },
  {
    id: 2,
    title: 'Ethereum\'s Layer 2 Solutions: Scaling the Future of Decentralized Finance',
    excerpt: 'Explore how Layer 2 technologies are solving Ethereum\'s scalability challenges and revolutionizing the DeFi landscape.',
    author: 'Michael Chen',
    date: 'April 10, 2024',
    readTime: '7 min read',
    tags: ['Ethereum', 'DeFi', 'Technology'],
    image: '../../public/Blog2.jpeg'
  },
  {
    id: 3,
    title: 'Institutional Adoption: How Major Companies Are Embracing Cryptocurrency',
    excerpt: 'From Tesla to BlackRock, we examine the growing trend of institutional investment in digital assets and what it means for the crypto ecosystem.',
    author: 'Emma Rodriguez',
    date: 'April 5, 2024',
    readTime: '6 min read',
    tags: ['Institutional Investors', 'Market Trends'],
    image: '../../public/Blog3.jpeg'
  },
  {
    id: 4,
    title: 'Solana\'s Rise: The Blockchain Challenging Ethereum\'s Dominance',
    excerpt: 'Discover how Solana is positioning itself as a high-performance blockchain with faster transactions and lower fees.',
    author: 'David Kim',
    date: 'March 28, 2024',
    readTime: '5 min read',
    tags: ['Solana', 'Blockchain Technology'],
    image: '../../public/Blog4.jpeg'
  },
  {
    id: 5,
    title: 'Regulatory Landscape: Global Approaches to Cryptocurrency Regulation',
    excerpt: 'An in-depth look at how different countries are developing frameworks to regulate digital assets and cryptocurrencies.',
    author: 'Alex Peterson',
    date: 'March 20, 2024',
    readTime: '8 min read',
    tags: ['Regulation', 'Global Markets'],
    image: '../../public/Blog5.jpeg'
  },
  {
    id: 6,
    title: 'The Future of NFTs: Beyond Digital Art and Collectibles',
    excerpt: 'Explore the evolving world of Non-Fungible Tokens and their potential applications across various industries.',
    author: 'Rachel Wong',
    date: 'March 15, 2024',
    readTime: '6 min read',
    tags: ['NFTs', 'Innovation'],
    image: '../../public/Blog1.jpeg'
  }
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  // Get unique tags
  const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];

  // Filter posts based on search and tag
  const filteredPosts = blogPosts.filter(post => 
    (searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedTag === null || post.tags.includes(selectedTag))
  );

  return (
    <>
      <Nav />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-black to-gray-900 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Crypto Insights & <span className="text-yellow-400">Market Trends</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Stay informed with the latest news, in-depth analysis, and expert perspectives on the rapidly evolving world of cryptocurrencies.
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search articles..."
                  className="w-full py-3 pl-10 pr-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags Filter */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag 
                    ? 'bg-yellow-500 text-gray-900' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No articles found matching your search or selected tag.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Blog Post Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Blog Post Content */}
                  <div className="p-6">
                    {/* Tags */}
                    <div className="flex gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Post Meta */}
                    <div className="flex justify-between items-center text-gray-500 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <div>{post.date}</div>
                    </div>

                    {/* Read More */}
                    <button className="mt-4 flex items-center text-yellow-600 hover:text-yellow-700 font-medium group">
                      Read Full Article
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Ahead of the Curve
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter and get the latest cryptocurrency insights, market analysis, and exclusive content delivered straight to your inbox.
            </p>
            
            <div className="max-w-xl mx-auto flex">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-grow py-3 px-4 rounded-l-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <button className="bg-gray-900 text-white px-6 py-3 rounded-r-lg hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;