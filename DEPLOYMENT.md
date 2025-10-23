# 🚀 Deployment Guide - TEACH Pricing Calculator

## 📋 Pre-Deployment Checklist

- ✅ Project built successfully (`npm run build`)
- ✅ Git repository initialized and committed
- ✅ README and documentation completed
- ✅ Vercel configuration ready

## 🌐 Deploy to Vercel (Recommended)

### Option 1: Vercel Dashboard (Easiest)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Import Project**
   - Click "New Project"
   - Import from Git Repository
   - Select `teach-pricing-calculator`

3. **Configure Project**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## 🐳 Alternative: Docker Deployment

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

## 🔧 Environment Configuration

### Required Environment Variables
None required - the calculator works with static data.

### Optional Customizations
Add to `.env.local` if needed:

```env
# Custom branding
NEXT_PUBLIC_COMPANY_NAME="Better Tech"
NEXT_PUBLIC_SUPPORT_EMAIL="comercial@bettertech.com.br"

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"
```

## 🎯 Domain Configuration

### Custom Domain on Vercel

1. **Purchase Domain** (if needed)
   - Use Vercel Domains or external registrar

2. **Add Domain**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

3. **Example Domains**
   - `pricing.bettertech.com.br`
   - `calculadora.teach-platform.com`
   - `proposta.bettertech.com.br`

## 📊 Performance Optimization

### Already Implemented
- ✅ Static generation (SSG)
- ✅ Optimized images
- ✅ Minimal bundle size
- ✅ CDN distribution via Vercel

### Monitoring
- Vercel Analytics (built-in)
- Core Web Vitals tracking
- Real User Monitoring

## 🔒 Security Features

### Implemented
- ✅ No server-side data storage
- ✅ Client-side only calculations
- ✅ No sensitive environment variables
- ✅ HTTPS by default on Vercel

## 🚀 Quick Deployment Commands

```bash
# 1. Final build and test
npm run build
npm start

# 2. Commit latest changes
git add .
git commit -m "Ready for production deployment"

# 3. Deploy to Vercel
npx vercel --prod

# 4. Set custom domain (optional)
vercel domains add your-domain.com
```

## 📱 Testing Deployment

### Checklist
- [ ] All course models load correctly
- [ ] Price calculations work for all tiers
- [ ] Extra features toggle properly (Premium)
- [ ] Proposal generation downloads correctly
- [ ] Mobile responsiveness works
- [ ] All forms validate properly

### Test Data
Use these test cases:

1. **Digital Course - Small School**
   - 50 teachers → R$ 6,000/month

2. **Interactive Course - Medium School**
   - 300 teachers → R$ 53,700/month

3. **Premium Course - Large District**
   - 1,500 teachers → R$ 450,000/month
   - With extras: +R$ 100,000/month

## 🌍 Global Settings

### Region Configuration
- Primary: São Paulo (gru1)
- Fallback: US East (iad1)

### CDN Settings
- Edge caching enabled
- Static assets optimized
- Brazilian Portuguese default

## 📞 Support & Maintenance

### Monitoring
- Vercel dashboard for analytics
- Error tracking via Vercel functions
- Performance metrics built-in

### Updates
```bash
# Update pricing models
# Edit: src/lib/pricing-models.ts

# Update UI/branding
# Edit: src/components/PricingCalculator.tsx

# Deploy updates
git add . && git commit -m "Update pricing" && git push
vercel --prod
```

---

## 🎉 Success!

Your TEACH Platform Pricing Calculator is now deployed and ready to use!

**Next Steps:**
1. Share the URL with your sales team
2. Test with real client scenarios  
3. Gather feedback for improvements
4. Monitor usage analytics

**URL:** `https://your-project.vercel.app`

---

*Deployed by Better Tech - Transforming Brazilian Education*