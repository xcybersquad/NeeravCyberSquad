// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize Google Map
function initMap() {
    const location = { lat: 21.1458, lng: 79.0882 }; // Coordinates for Nagpur
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: location,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [{"color": "#242f3e"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{"lightness": -80}]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#746855"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#17263c"}]
            }
        ]
    });
    
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'X Cyber Squad',
        animation: google.maps.Animation.DROP
    });

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px;">
                <h5 style="margin: 0 0 5px;">X Cyber Squad</h5>
                <p style="margin: 0;">Rajnigandha Apart opp LIC Flats,<br>Dhantoli, Nagpur 440012</p>
            </div>
        `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

// Handle Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    submitButton.disabled = true;

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    try {
        // Here you would typically send this data to your backend server
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success alert-dismissible fade show mt-3';
        successAlert.innerHTML = `
            <strong>Success!</strong> Thank you for your message. We will get back to you soon.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        this.appendChild(successAlert);
        this.reset();
    } catch (error) {
        // Show error message
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger alert-dismissible fade show mt-3';
        errorAlert.innerHTML = `
            <strong>Error!</strong> There was a problem sending your message. Please try again.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        this.appendChild(errorAlert);
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

// News Sources Configuration
const newsSources = {
    thehackernews: {
        url: 'https://feeds.feedburner.com/TheHackersNews',
        name: 'The Hacker News'
    },
    bleepingcomputer: {
        url: 'https://www.bleepingcomputer.com/feed/',
        name: 'Bleeping Computer'
    },
    threatpost: {
        url: 'https://threatpost.com/feed/',
        name: 'Threatpost'
    }
};

let currentNewsSource = 'all';
let currentPage = 1;
const newsPerPage = 6;

// Handle news source selection
document.querySelectorAll('.news-sources .btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelector('.news-sources .btn.active').classList.remove('active');
        this.classList.add('active');
        currentNewsSource = this.dataset.source;
        currentPage = 1;
        fetchNews();
    });
});

// Handle load more news
document.getElementById('load-more-news').addEventListener('click', () => {
    currentPage++;
    fetchNews(true);
});

// Fetch and Display Cybersecurity News
async function fetchNews(append = false) {
    try {
        const newsContainer = document.getElementById('news-container');
        const loadMoreBtn = document.getElementById('load-more-news');
        
        if (!append) {
            newsContainer.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        }

        // Simulate fetching news from multiple sources (replace with actual API calls)
        const newsData = await Promise.all(Object.entries(newsSources)
            .filter(([source]) => currentNewsSource === 'all' || currentNewsSource === source)
            .map(async ([source, config]) => {
                try {
                    // In production, replace this with actual RSS feed parsing or API calls
                    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(config.url)}`);
                    const data = await response.json();
                    return data.items.map(item => ({
                        ...item,
                        source: config.name
                    }));
                } catch (error) {
                    console.error(`Error fetching news from ${config.name}:`, error);
                    return [];
                }
            }));

        const allNews = newsData
            .flat()
            .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        const startIndex = (currentPage - 1) * newsPerPage;
        const endIndex = startIndex + newsPerPage;
        const newsToDisplay = allNews.slice(startIndex, endIndex);

        if (!append) {
            newsContainer.innerHTML = '';
        }

        newsToDisplay.forEach((article, index) => {
            const newsItem = document.createElement('div');
            newsItem.className = 'col-md-4 mb-4';
            newsItem.setAttribute('data-aos', 'fade-up');
            newsItem.setAttribute('data-aos-delay', (index * 100).toString());
            
            newsItem.innerHTML = `
                <div class="news-item">
                    <img src="${article.thumbnail || 'images/news-placeholder.svg'}" class="card-img-top" alt="News Image">
                    <div class="card-body p-4">
                        <span class="badge bg-primary mb-2">${article.source}</span>
                        <h5 class="card-title">${article.title}</h5>
                        <p class="news-date text-muted mb-2">${new Date(article.pubDate).toLocaleString()}</p>
                        <p class="card-text">${article.description.slice(0, 150)}...</p>
                        <a href="${article.link}" target="_blank" class="btn btn-outline-primary">Read More</a>
                    </div>
                </div>
            `;
            newsContainer.appendChild(newsItem);
        });

        // Show/hide load more button
        loadMoreBtn.style.display = endIndex >= allNews.length ? 'none' : 'inline-block';
    } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('news-container').innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Error loading news. Please try again later.</p>
            </div>
        `;
    }
}

// Initialize news feed
fetchNews();

// Update news every 30 minutes
setInterval(fetchNews, 1800000);

// Typing animation for hero section
const heroText = document.querySelector('.hero-section h1');
if (heroText) {
    const text = heroText.textContent;
    heroText.textContent = '';
    let index = 0;

    function typeText() {
        if (index < text.length) {
            heroText.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 100);
        }
    }

    // Start typing animation when the page loads
    window.addEventListener('load', typeText);
}

// Initialize map when the page loads
window.onload = initMap;
