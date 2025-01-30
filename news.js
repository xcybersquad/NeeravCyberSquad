// Function to fetch news
async function fetchNews(topic = 'cybersecurity') {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${topic}&sortBy=publishedAt&apiKey=YOUR_NEWS_API_KEY`);
        const data = await response.json();
        
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = '';

        data.articles.slice(0, 10).forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item mb-4';
            newsItem.innerHTML = `
                <div class="card">
                    <img src="${article.urlToImage || 'images/news-placeholder.jpg'}" class="card-img-top" alt="News Image">
                    <div class="card-body">
                        <h3 class="card-title">${article.title}</h3>
                        <p class="news-date">${new Date(article.publishedAt).toLocaleString()}</p>
                        <p class="card-text">${article.description}</p>
                        <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
                    </div>
                </div>
            `;
            newsContainer.appendChild(newsItem);
        });

        // Update trending section
        updateTrendingNews(data.articles.slice(0, 5));
    } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('news-container').innerHTML = '<p class="text-danger">Error loading news. Please try again later.</p>';
    }
}

// Function to update trending news
function updateTrendingNews(articles) {
    const trendingContainer = document.getElementById('trending-news');
    trendingContainer.innerHTML = '';

    articles.forEach(article => {
        const trendingItem = document.createElement('div');
        trendingItem.className = 'trending-item mb-3';
        trendingItem.innerHTML = `
            <a href="${article.url}" target="_blank" class="text-decoration-none">
                <h4 class="small">${article.title}</h4>
                <p class="text-muted smaller">${new Date(article.publishedAt).toLocaleDateString()}</p>
            </a>
        `;
        trendingContainer.appendChild(trendingItem);
    });
}

// Event listeners for topic links
document.querySelectorAll('.topic-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const topic = e.target.dataset.topic;
        fetchNews(topic);
    });
});

// Initial news fetch
fetchNews();

// Update news every hour
setInterval(() => fetchNews(), 3600000);
