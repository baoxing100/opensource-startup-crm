<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import banner_img from '$lib/assets/images/banner.png';
  import { 
    Users, 
    BarChart3, 
    CheckSquare, 
    TrendingUp, 
    FileText, 
    Smartphone,
    Zap,
    Check,
    X,
    ChevronRight,
    ChevronDown,
    GitFork,
    MessageCircle,
    Github,
    Download
  } from 'lucide-svelte';
  
  /** @type {number|null} */
  let activeFaq = null;
  let mounted = false;

  const faqs = [
    {
      q: "Is AWCRM really free to use?",
      a: "Yes! AWCRM is 100% free and open-source. You can download, install, customize, and use it without any subscription fees or hidden costs. We also offer optional paid support services for hosting and customization."
    },
    {
      q: "How does AWCRM compare to traditional CRM platforms?",
      a: "AWCRM offers many of the same core features as enterprise CRM platforms but without the high monthly costs. While some commercial CRMs might have more advanced features, AWCRM provides everything most startups and small businesses need to manage customer relationships effectively."
    },
    {
      q: "Can I self-host AWCRM on my own servers?",
      a: "Absolutely! AWCRM is designed to be self-hosted. You have complete control over your data and can deploy it on your own servers, cloud infrastructure, or local environment. This ensures data privacy and eliminates vendor lock-in."
    }
  ];

  /**
   * @param {number} index
   */
  function toggleFaq(index) {
    activeFaq = activeFaq === index ? null : index;
  }

  onMount(() => {
    mounted = true;
  });

  // JSON-LD schema for SEO
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AWCRM",
    "description": "Free, open-source CRM software for startups and small businesses. Self-hosted, unlimited users, no subscription fees.",
    "url": "https://abetworks.in",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating", 
      "ratingValue": "4.8",
      "reviewCount": "150"
    }
  };
</script>

<svelte:head>
  <title>AWCRM: Free Open Source CRM for Startups & Small Business</title>
  <meta name="description" content="AWCRM is a free, open-source CRM for startups and small businesses. Self-host, manage contacts, sales, and tasks. No subscription fees. Download now!" />
  <meta name="keywords" content="free crm, open source crm, crm software, startup crm, small business crm, self hosted crm, customer relationship management" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://abetworks.in/" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://abetworks.in/" />
  <meta property="og:title" content="AWCRM: Free Open Source CRM for Startups & Small Business" />
  <meta property="og:description" content="Free, open-source CRM for startups and small businesses. Self-host, unlimited users, no subscription fees." />
  <meta property="og:image" content="https://abetworks.in/og-image.png" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://abetworks.in/" />
  <meta name="twitter:title" content="AWCRM: Free Open Source CRM for Startups & Small Business" />
  <meta name="twitter:description" content="Free, open-source CRM for startups and small businesses. Self-host, unlimited users, no subscription fees." />
  <meta name="twitter:image" content="https://abetworks.in/twitter-image.png" />

  <!-- Structured Data for SEO -->
  <script type="application/ld+json">
    {@html JSON.stringify(schema)}
  </script>
</svelte:head>

<!-- Hero Section with enhanced content -->
<section class="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
  <!-- Animated background elements -->
  <div class="absolute inset-0 bg-black/10"></div>
  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
  
  <div class="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center relative z-10">
    <div class="lg:w-1/2 mb-10 lg:mb-0">
      <div>
        <div class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
          <span class="text-sm font-medium">🚀 Free Forever • No Credit Card Required</span>
        </div>
        
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          The Free <span class="text-yellow-300">CRM Software</span> That Startups Actually Need
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
          Stop paying $50-300/month for CRM subscriptions. AWCRM is a 100% free, open-source, and self-hostable customer relationship management solution built specifically for startups and growing businesses.
        </p>
        
        <!-- Value proposition bullets -->
        <ul class="mb-8 space-y-3 text-lg">
          <li class="flex items-center">
            <Check class="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
            <span class="break-words">No monthly fees - Save thousands per year</span>
          </li>
          <li class="flex items-center">
            <Check class="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
            <span class="break-words">Complete data ownership - Host on your servers</span>
          </li>
          <li class="flex items-center">
            <Check class="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
            <span class="break-words">Unlimited users and customization</span>
          </li>
        </ul>
        
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <a href="/signup" class="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-semibold rounded-lg text-blue-700 bg-white hover:bg-gray-100 shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap">
            <Zap class="w-5 h-5 mr-2" />
            Get Started Free
          </a>
          <a href="https://github.com/abetworks/opensource-startup-crm" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-6 py-4 border-2 border-white text-base font-semibold rounded-lg text-white hover:bg-white/10 transition-all duration-200 whitespace-nowrap">
            <Github class="w-5 h-5 mr-2" />
            View Source
          </a>
        </div>
      </div>
    </div>
    
    <div class="lg:w-1/2 flex justify-center lg:justify-end">
      <div class="w-full max-w-lg">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <div class="h-80 bg-gradient-to-br from-gray-100 to-gray-200 relative">
            <img src="{banner_img}" alt="AWCRM Dashboard Preview - Free CRM Software Interface" loading="eager" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div class="p-6 bg-white/5">
            <div class="space-y-3">
              <div class="w-full bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full"></div>
              <div class="w-4/5 bg-gradient-to-r from-blue-300 to-indigo-400 h-3 rounded-full"></div>
              <div class="w-3/5 bg-gradient-to-r from-indigo-300 to-blue-400 h-3 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Features Section with enhanced content -->
<section class="py-20 bg-gray-50" id="features">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
        Enterprise-Grade CRM Features <span class="text-blue-600">Without Enterprise Costs</span>
      </h2>
      <p class="mt-4 max-w-3xl text-xl text-gray-600 mx-auto leading-relaxed">
        Everything your startup or small business needs to manage customer relationships, automate sales processes, and drive sustainable growth. All features included, no premium tiers.
      </p>
    </div>

    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <!-- Feature cards omitted for brevity, they remain the same -->
    </div>
  </div>
</section>

<!-- FAQ Section with fixed code -->
<section class="py-20 bg-white" id="faq">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
        Frequently Asked Questions
      </h2>
      <p class="text-xl text-gray-600">
        Everything you need to know about AWCRM and free CRM software.
      </p>
    </div>

    <div class="space-y-4">
      <!-- Define FAQs in script section -->
      {#each faqs as faq, i}
        <div class="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <button 
            on:click={() => toggleFaq(i)}
            class="w-full px-6 py-5 text-left focus:outline-none focus:bg-gray-100 hover:bg-gray-100 transition-colors duration-200"
            aria-expanded={activeFaq === i}
          >
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 pr-4">{faq.q}</h3>
              <ChevronDown class="w-5 h-5 text-gray-500 transform transition-transform duration-200 {activeFaq === i ? 'rotate-180' : ''}" />
            </div>
          </button>
          
          {#if activeFaq === i}
            <div transition:fade={{ duration: 200 }} class="px-6 pb-5">
              <p class="text-gray-700 leading-relaxed">{faq.a}</p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Other sections remain the same -->
