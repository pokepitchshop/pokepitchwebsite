# PokePitchShop SEO Setup Guide

## ✅ Completed SEO Implementations

### 1. **Meta Tags & Metadata**
- ✅ Title tag: "PokePitchShop - Authentic Pokemon & Sports Trading Cards"
- ✅ Meta description with keywords
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card tags
- ✅ Canonical URL
- ✅ Robots meta tags

### 2. **Technical SEO**
- ✅ robots.txt file created
- ✅ sitemap.xml created
- ✅ Structured data (JSON-LD) implemented
- ✅ Google Analytics setup ready
- ✅ Proper image alt tags
- ✅ Semantic HTML structure

### 3. **Content Optimization**
- ✅ Relevant keywords in headings and content
- ✅ Descriptive alt text for images
- ✅ Internal linking structure
- ✅ Contact information and business hours

## 🔧 Next Steps to Complete SEO Setup

### 1. **Google Search Console Setup**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your domain (pokepitchshop.com)
3. Verify ownership (choose HTML tag method)
4. Replace `'your-google-verification-code'` in `app/layout.tsx` with your actual verification code
5. Submit your sitemap.xml

### 2. **Google Analytics Setup**
1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new property for pokepitchshop.com
3. Get your Measurement ID (starts with G-)
4. Replace `GA_MEASUREMENT_ID` in `app/analytics.tsx` with your actual ID

### 3. **Domain & Hosting Setup**
1. Purchase domain: pokepitchshop.com
2. Set up hosting (Vercel, Netlify, or similar)
3. Configure DNS settings
4. Set up SSL certificate (HTTPS)

### 4. **Additional SEO Optimizations**

#### **Page Speed Optimization**
- Optimize images (compress, use WebP format)
- Enable gzip compression
- Use CDN for static assets
- Minimize CSS/JS files

#### **Local SEO** (if you have a physical location)
- Create Google My Business listing
- Add local business schema markup
- Include address and phone number

#### **Content Marketing**
- Start a blog about trading cards
- Create product-specific pages
- Add customer testimonials
- Include FAQ section

#### **Social Media**
- Create business accounts on:
  - Instagram (showcase cards)
  - Facebook (community building)
  - Twitter (updates and engagement)
  - YouTube (unboxing videos, card reviews)

### 5. **Monitoring & Maintenance**
- Set up Google Search Console alerts
- Monitor Core Web Vitals
- Track keyword rankings
- Regular content updates
- Monitor competitor analysis

## 🎯 Target Keywords

### **Primary Keywords**
- Pokemon cards
- Sports trading cards
- Graded cards
- Rare Pokemon cards
- Authentic trading cards

### **Long-tail Keywords**
- "authentic Pokemon cards for sale"
- "PSA graded sports cards"
- "vintage Pokemon card collection"
- "rare baseball cards near me"
- "trusted trading card seller"

## 📊 SEO Performance Tracking

### **Key Metrics to Monitor**
- Organic traffic growth
- Keyword rankings
- Click-through rate (CTR)
- Bounce rate
- Page load speed
- Mobile usability

### **Tools to Use**
- Google Search Console
- Google Analytics
- Google PageSpeed Insights
- SEMrush or Ahrefs (for competitor analysis)
- Screaming Frog (for technical SEO audits)

## 🚀 Quick Wins

1. **Submit to Google Search Console** - Get indexed faster
2. **Optimize images** - Improve page speed
3. **Add more content** - Blog posts about trading cards
4. **Get customer reviews** - Build trust and local SEO
5. **Create social media presence** - Drive traffic and engagement

## 📝 Content Calendar Ideas

### **Weekly Blog Posts**
- "Top 10 Most Valuable Pokemon Cards of 2024"
- "How to Spot Fake Trading Cards"
- "The History of Baseball Cards"
- "PSA vs BGS: Which Grading Service is Better?"
- "Trading Card Investment Guide"

### **Social Media Content**
- Daily card showcases
- Behind-the-scenes content
- Customer testimonials
- Industry news and updates
- Interactive polls and questions

## Post-deploy checklist (Search Console)

After deploying SEO updates:

1. Open [Google Search Console](https://search.google.com/search-console) for `pokepitchshop.com`
2. Go to **Sitemaps** and submit `https://pokepitchshop.com/sitemap.xml`
3. Use **URL Inspection** to request indexing for:
   - `https://pokepitchshop.com/`
   - `https://pokepitchshop.com/catalog/pokemon`
   - One product page, e.g. `https://pokepitchshop.com/catalog/ebay-{itemId}`
   - One blog post, e.g. `https://pokepitchshop.com/blog/how-to-spot-fake-trading-cards`
4. Monitor **Pages** report over 2–4 weeks for indexed catalog URLs to climb toward ~1,600+

The sitemap is generated dynamically by `app/sitemap.ts` from live eBay inventory and blog posts — no static `public/sitemap.xml` file is required.

---