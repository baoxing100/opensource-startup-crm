<script>
	import { marked } from 'marked';
    
    import { MetaTags } from "svelte-meta-tags";
    import Highlight from "svelte-highlight";
    import python from "svelte-highlight/languages/python";
    import "svelte-highlight/styles/github-dark.css"
    import { Edit, Facebook, Twitter, Linkedin, Share2 } from "lucide-svelte";
    
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
</script>

<div class="min-h-screen bg-white dark:bg-gray-900 transition-colors">
  <!-- Header with Edit Button -->
  <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <nav class="text-sm text-gray-500 dark:text-gray-400">
          <span>Admin</span> <span class="mx-2">/</span> <span>Blogs</span> <span class="mx-2">/</span> <span class="text-gray-900 dark:text-white">{data.blog?.title || 'Blog'}</span>
        </nav>
        <a
          href={`/admin/blogs/${data.blog?.id}/edit`}
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <Edit size={16} />
          Edit Blog
        </a>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Blog Header -->
    <header class="text-center mb-12">
      <div class="mb-4">
        <span class="inline-block px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 font-medium text-sm">
          Blog Post
        </span>
      </div>
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
        {data.blog?.title || 'Untitled'}
      </h1>
    </header>

    <!-- Blog Content -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Main Content Column -->
      <article class="lg:col-span-8 xl:col-span-9">
        <div class="prose prose-lg dark:prose-invert max-w-none">
          {#each data.blog?.contentBlocks || [] as block}
            <div class="mb-8">
              {#if block.type == "MARKDOWN"}
                <div class="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {@html marked(block.content)}
                </div>
              {/if}

              {#if block.type == "CODE"}
                <div class="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <Highlight language={python} code={block.content} />
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Share Section -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div class="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                <Share2 size={20} />
                Share this post
              </div>
              <div class="flex flex-wrap gap-3">
                <a 
                  href="https://www.facebook.com/MicroPyramid" 
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook size={16} />
                  Facebook
                </a>
                <a 
                  href="https://x.com/micropyramid" 
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter size={16} />
                  X
                </a>
                <a 
                  href="https://www.linkedin.com/company/micropyramid" 
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Sidebar -->
      <aside class="lg:col-span-4 xl:col-span-3">
        <div class="sticky top-24">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Blog Details</h3>
            <div class="space-y-3 text-sm">
              <div>
                <span class="text-gray-600 dark:text-gray-400">Type:</span>
                <span class="ml-2 text-gray-900 dark:text-white">Blog Post</span>
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400">Status:</span>
                <span class="ml-2 inline-block px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium">Published</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </main>
</div>

<MetaTags
  title={data.blog?.seoTitle || 'Blog Post'}
  titleTemplate="%s | BottleCRM"
  description={data.blog?.seoDescription || 'Blog post'}
  canonical={"https://bottlecrm.com/blog/" + (data.blog?.slug || '') + "/"}
  openGraph={{
    url: data.blog?.slug || '',
    title: data.blog?.seoTitle || 'Blog Post',
    description: data.blog?.seoDescription || 'Blog post',
    images: [
      {
        url: "https://bottlecrm.com/images/logo.png",
        width: 800,
        height: 600,
        alt: "BottleCRM - Open Source CRM Solution",
      },
    ],
    siteName: "BottleCRM",
  }}
  twitter={{
    site: "@bottlecrm",
    cardType: "summary_large_image",
    title: data.blog?.seoTitle || 'Blog Post',
    description: data.blog?.seoDescription || 'Blog post',
    image: "https://bottlecrm.com/images/logo.png",
    imageAlt: "BottleCRM - Open Source CRM Solution",
  }}
/>
