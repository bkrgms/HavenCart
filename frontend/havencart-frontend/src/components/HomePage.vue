<template>
  <div class="homepage-bg">
    <!-- Navbar -->
    <header class="navbar">
      <div class="navbar-left">HANDMADE & HOME</div>
      <nav class="navbar-menu">
        <a href="#">Products</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
      <div class="navbar-right">
        <a href="#" class="login-link">Login</a>
        <button class="search-btn">Search</button>
      </div>
    </header>
    <hr class="nav-divider" />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-text">
        <h1>EXPLORE OUR HANDMADE<br />AND HOME PRODUCTS</h1>
        <div class="hero-btns">
          <button class="outline-btn">Shop Products</button>
          <button class="outline-btn">Learn More</button>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Hero" />
      </div>
    </section>
    <hr class="section-divider" />

    <!-- Featured Products -->
    <section class="featured-products">
      <h2>Featured Products</h2>
      <div class="featured-list">
        <div class="featured-card">
          <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80" alt="Product" />
          <div class="card-footer">
            <hr />
            <button class="outline-btn small">Shop</button>
          </div>
        </div>
        <div class="featured-card">
          <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=300&q=80" alt="Product" />
          <div class="card-footer">
            <hr />
            <button class="outline-btn small">Shop</button>
          </div>
        </div>
        <div class="featured-card">
          <img src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=300&q=80" alt="Product" />
          <div class="card-footer">
            <hr />
            <button class="outline-btn small">Shop</button>
          </div>
        </div>
        <div class="featured-card">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80" alt="Product" />
          <div class="card-footer">
            <hr />
            <span class="popular-label">Popular Items</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories & Popular Items -->
    <section class="categories-popular">
      <div class="categories">
        <h2>Product Categories</h2>
        <div class="cat-list">
          <div class="cat-card">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80" alt="Category" />
          </div>
          <div class="cat-card">
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80" alt="Category" />
          </div>
          <div class="cat-card">
            <img src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=200&q=80" alt="Category" />
          </div>
        </div>
      </div>
      <div class="popular">
        <h2>Popular Items</h2>
        <div class="popular-list">
          <div class="popular-card">
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=80" alt="Popular" />
          </div>
          <div class="popular-card">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80" alt="Popular" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
}
</script>

<style scoped>
.homepage-bg {
  background: #f6eddf;
  min-height: 100vh;
  font-family: 'Montserrat', Arial, sans-serif;
  width: 100vw;
  margin: 0;
  padding: 0;
}
.main-container {
  max-width: 1920px;
  margin: 0 auto;
  padding: 0;
  width: 100vw;
  box-sizing: border-box;
}
.navbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2vw;
  padding: 32px 3vw 0 3vw;
  background: transparent;
  width: 100%;
  box-sizing: border-box;
}
.navbar-left {
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 1px;
}
.navbar-menu {
  display: flex;
  gap: 32px;
  flex: 1;
}
.navbar-menu a {
  color: #222;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-left: auto;
}
.login-link {
  color: #222;
  text-decoration: none;
  font-size: 1.1rem;
}
.search-btn {
  border: 2px solid #222;
  background: transparent;
  padding: 4px 18px;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
}
.nav-divider {
  border: none;
  border-top: 2px solid #222;
  margin: 2vw 0;
  width: 100%;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  width: 100%;
  padding: 0 2vw;
  box-sizing: border-box;
}
.hero-text h1 {
  font-size: 2.8vw;
  font-weight: 700;
  margin-bottom: 2vw;
  color: #222;
}
.hero-btns {
  display: flex;
  gap: 2vw;
}
.outline-btn {
  border: 2px solid #222;
  background: transparent;
  color: #222;
  font-size: 1.2vw;
  padding: 1vw 2vw;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
.outline-btn:hover {
  background: #222;
  color: #fff;
}
.hero-image img {
  width: 18vw;
  height: 14vw;
  min-width: 220px;
  min-height: 180px;
  object-fit: cover;
  border: 2px solid #222;
  border-radius: 4px;
  background: #fff;
}
.section-divider {
  border: none;
  border-top: 2px solid #222;
  margin: 2vw 0;
  width: 100%;
}

.featured-products {
  width: 100%;
  margin: 0 auto 32px auto;
  padding: 0;
  box-sizing: border-box;
}
.featured-products h2 {
  font-size: 2vw;
  font-weight: 600;
  margin-bottom: 2vw;
  color: #222;
}
.featured-list {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 0 24px;
  box-sizing: border-box;
}
.featured-card {
  background: #f6eddf;
  border: 2px solid #222;
  border-radius: 4px;
  padding: 32px 16px 0 16px;
  width: calc((100% - 3 * 24px) / 4);
  min-width: 220px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  box-sizing: border-box;
}
.featured-card img {
  width: 16vw;
  height: 9vw;
  min-width: 180px;
  min-height: 100px;
  object-fit: cover;
  border-radius: 2px;
  background: #fff;
  border: 1px solid #222;
}
.card-footer {
  width: 100%;
  margin-top: 1vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.card-footer hr {
  width: 60%;
  border: none;
  border-top: 2px solid #222;
  margin: 1vw 0 1vw 0;
}
.outline-btn.small {
  font-size: 1vw;
  padding: 0.7vw 1.5vw;
}
.popular-label {
  font-size: 1.1vw;
  font-weight: 600;
  margin-top: 1vw;
}

.categories-popular {
  display: flex;
  gap: 2vw;
  padding-bottom: 2vw;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
}
.categories, .popular {
  flex: 1;
}
.categories h2, .popular h2 {
  font-size: 1.5vw;
  font-weight: 600;
  margin-bottom: 1.5vw;
  color: #222;
}
.cat-list, .popular-list {
  display: flex;
  gap: 24px;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 0 24px;
  box-sizing: border-box;
}
.cat-card, .popular-card {
  background: #f6eddf;
  border: 2px solid #222;
  border-radius: 4px;
  width: calc((100% - 2 * 24px) / 3);
  min-width: 120px;
  max-width: 100%;
  height: 8vw;
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.cat-card img, .popular-card img {
  width: 8vw;
  min-width: 90px;
  height: 6vw;
  min-height: 60px;
  object-fit: cover;
  border-radius: 2px;
  background: #fff;
  border: 1px solid #222;
}

@media (max-width: 1100px) {
  .hero-section, .categories-popular, .featured-products {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  .hero-section {
    padding: 0 2vw;
  }
  .featured-products, .categories-popular {
    padding: 0 2vw 24px 2vw;
  }
}
@media (max-width: 700px) {
  .navbar {
    flex-direction: column;
    gap: 12px;
    padding: 18px 2vw 0 2vw;
  }
  .hero-section, .categories-popular, .featured-products {
    padding: 0 2vw 12px 2vw;
  }
  .hero-text h1 {
    font-size: 1.5rem;
  }
  .featured-list, .cat-list, .popular-list {
    flex-direction: column;
    gap: 10px;
  }
  .featured-card, .cat-card, .popular-card {
    width: 100%;
    min-width: unset;
    max-width: unset;
  }
}
</style> 