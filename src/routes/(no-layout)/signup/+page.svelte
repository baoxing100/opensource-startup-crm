<script>
    import { enhance } from '$app/forms';
    import { Mail, Lock, User, AlertCircle } from 'lucide-svelte';
    
    export let form;
    let isLoading = false;
    
    function handleSubmit() {
        isLoading = true;
        return async ({ result }) => {
            isLoading = false;
        };
    }
</script>

<svelte:head>
    <title>Sign Up | AWCRM - Free Open-Source CRM for Startups</title>
    <meta name="description" content="Create your free AWCRM account - the completely free, open-source CRM solution for startups and small businesses." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8">
            <h1 class="text-2xl font-bold text-center mb-8">Create Your Account</h1>
            
            <form 
                method="POST" 
                action="?/signup"
                use:enhance={handleSubmit}
                class="space-y-4">
                
                <!-- Name Input -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User class="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="John Doe"
                        />
                    </div>
                </div>
                
                <!-- Email Input -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail class="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="you@company.com"
                        />
                    </div>
                </div>

                <!-- Password Input -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock class="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            minlength="8"
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Min. 8 characters"
                        />
                    </div>
                </div>

                <!-- Error Message -->
                {#if form?.error}
                    <div class="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle class="h-4 w-4" />
                        <span>{form.error}</span>
                    </div>
                {/if}

                <!-- Submit Button -->
                <button
                    type="submit"
                    disabled={isLoading}
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 flex items-center justify-center"
                >
                    {#if isLoading}
                        <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Creating account...
                    {:else}
                        Create Account
                    {/if}
                </button>
            </form>

            <p class="mt-4 text-center text-sm text-gray-600">
                Already have an account?
                <a href="/login" class="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in here
                </a>
            </p>
        </div>
    </div>
</div>
