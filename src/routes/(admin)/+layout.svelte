<script>
    import '../../app.css'
    import { Menu, Bell, User, Search, FileText, Settings, ChartBar, Home, X, LogOut } from 'lucide-svelte';
    
    /** @type {{ data?: any, children: import('svelte').Snippet }} */
    let { data, children } = $props();
    
    let mobileMenuOpen = $state(false);
    
    const handleLogout = () => {
        // Perform logout action - you might want to redirect to logout endpoint
        window.location.href = '/logout';
    };
    
</script>

<div class="min-h-screen bg-gray-50">
    <!-- Top navigation -->
    <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo and primary navigation -->
                <div class="flex items-center">
                    <!-- Logo -->
                    <div class="flex-shrink-0">
                        <h1 class="text-xl font-bold text-blue-600">AWCRM</h1>
                    </div>
                    
                    <!-- Desktop navigation -->
                    <nav class="hidden md:ml-8 md:flex md:space-x-1">
                        <a href="/admin" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors">
                            <Home class="w-4 h-4 mr-2" />
                            Dashboard
                        </a>
                        <a href="/admin/blogs" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors">
                            <FileText class="w-4 h-4 mr-2" />
                            Blog Posts
                        </a>
                        <a href="/admin/contacts" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors">
                            <User class="w-4 h-4 mr-2" />
                            Contact Submissions
                        </a>
                        <a href="/admin/newsletter" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors">
                            <ChartBar class="w-4 h-4 mr-2" />
                            Newsletter
                        </a>
                    </nav>
                </div>

                <!-- Right side items -->
                <div class="flex items-center space-x-4">
                   
                    <!-- User logout -->
                    <a 
                        class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                        href="/logout">
                        <LogOut class="w-4 h-4" />
                        <span class="hidden sm:block">Logout</span>
                    </a>

                    <!-- Mobile menu button -->
                    <button 
                        class="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        onclick={() => mobileMenuOpen = !mobileMenuOpen}
                    >
                        {#if mobileMenuOpen}
                            <X class="w-6 h-6" />
                        {:else}
                            <Menu class="w-6 h-6" />
                        {/if}
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile navigation menu -->
        {#if mobileMenuOpen}
            <div class="md:hidden border-t border-gray-200">
                <nav class="px-4 py-3 space-y-1">
                    <a href="/admin" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors" onclick={() => mobileMenuOpen = false}>
                        <Home class="w-5 h-5 mr-3" />
                        Dashboard
                    </a>
                    <a href="/admin/blogs" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors" onclick={() => mobileMenuOpen = false}>
                        <FileText class="w-5 h-5 mr-3" />
                        Blog Posts
                    </a>
                    <a href="/admin/contacts" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors" onclick={() => mobileMenuOpen = false}>
                        <User class="w-5 h-5 mr-3" />
                        Contact Submissions
                    </a>
                    <a href="/admin/analytics" class="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors" onclick={() => mobileMenuOpen = false}>
                        <ChartBar class="w-5 h-5 mr-3" />
                        Analytics
                    </a>
                    
                    <!-- Mobile logout -->
                    <button 
                        class="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                        onclick={handleLogout}
                    >
                        <LogOut class="w-5 h-5 mr-3" />
                        Logout
                    </button>
                    
                    <!-- Mobile search -->
                    <div class="pt-2">
                        <div class="relative">
                            <label for="admin-search" class="sr-only">Search</label>
                            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                id="admin-search"
                                type="text" 
                                placeholder="Search..." 
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>
                </nav>
            </div>
        {/if}
    </header>

    <!-- Main content area -->
    <main class="p-6">
        {@render children()}
    </main>
</div>