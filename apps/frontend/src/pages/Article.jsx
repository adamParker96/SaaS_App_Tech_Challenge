//  This code is how our Frontend code communicates with our Backend to pull Articles.

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);  //  set default values for article
  const [loading, setLoading] = useState(true);  //  set default values for loading

  useEffect(() => {
    fetch(`http://localhost:4000/articles/${id}`)  // point to our exposed port and make a call to our backend via the API
      .then(res => {  //  res = whatever the fetch results our
        if (!res.ok) throw new Error('Not found');
        return res.json();  //  turn our results into json
      })
      .then(data => {  //  data = our json results
        setArticle(data);  //  update the value for 'article'
        setLoading(false);
      })
      .catch(err => {  //  error handling
        console.error('Failed to load article', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-700 whitespace-pre-wrap">{article.content}</p>
    </div>
  );
}
