<script>
    import { enhance } from '$app/forms';
    import { Mail, AlertCircle } from 'lucide-svelte';
    
    export let form;
    let isLoading = false;
    
    function handleSubmit() {
        isLoading = true;
        return async ({ result }) => {
            isLoading = false;
        };
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8">
            <h1 class="text-2xl font-bold text-center mb-2">Reset Password</h1>
            <p class="text-gray-600 text-sm text-center mb-8">
                Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            <form 
                method="POST" 
                action="?/requestReset"
                use:enhance={handleSubmit}
                class="space-y-4">
                
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

                <!-- Error/Success Message -->
                {#if form?.error}
                    <div class="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle class="h-4 w-4" />
                        <span>{form.error}</span>
                    </div>
                {:else if form?.success}
                    <div class="bg-green-50 text-green-800 rounded-lg p-4 text-sm">
                        {form.success}
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
                        Sending...
                    {:else}
                        Send Reset Instructions
                    {/if}
                </button>
            </form>

            <div class="mt-6 text-center text-sm">
                <a href="/login" class="text-blue-600 hover:text-blue-700">
                    Back to Login
                </a>
            </div>
        </div>
    </div>
</div>
