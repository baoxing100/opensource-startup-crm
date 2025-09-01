<!-- EmailLoginForm.svelte -->
<script>
    import { enhance } from '$app/forms';
    import { Mail, Lock, AlertCircle } from 'lucide-svelte';

    export let form;
    
    let isLoading = false;
    
    function handleSubmit() {
        isLoading = true;
        return async ({ result, update }) => {
            isLoading = false;
            
            // Handle different result types
            if (result.type === 'redirect') {
                // Let SvelteKit handle the redirect
                window.location.href = result.location;
            } else if (result.type === 'failure') {
                // Update the form with error data
                await update();
            } else {
                // For other result types, use default update
                await update();
            }
        };
    }
</script>

<form 
    method="POST" 
    action="?/login"
    use:enhance={handleSubmit}
    class="space-y-4 mb-6">
    
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
                placeholder="your@email.com"
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
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
            />
        </div>
        <div class="text-right">
            <a href="/forgot-password" class="text-sm text-blue-600 hover:text-blue-700">
                Forgot your password?
            </a>
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
            Signing in...
        {:else}
            Sign in with Email
        {/if}
    </button>
</form>
