<script>
    import { enhance } from '$app/forms';
    import { Lock, AlertCircle } from 'lucide-svelte';
    
    export let data;
    export let form;
    
    let isLoading = false;
    let password = '';
    let confirmPassword = '';
    let passwordsMatch = true;
    
    function handleSubmit() {
        isLoading = true;
        passwordsMatch = password === confirmPassword;
        
        if (!passwordsMatch) {
            isLoading = false;
            return false;
        }
        
        return async ({ result }) => {
            isLoading = false;
        };
    }

    $: passwordsMatch = !confirmPassword || password === confirmPassword;
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8">
            <h1 class="text-2xl font-bold text-center mb-2">Reset Your Password</h1>
            <p class="text-gray-600 text-sm text-center mb-8">
                Enter your new password below.
            </p>
            
            <form 
                method="POST" 
                action="?/resetPassword"
                use:enhance={handleSubmit}
                class="space-y-4">
                
                <input type="hidden" name="token" value={data.token}>
                
                <!-- Password Input -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock class="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            bind:value={password}
                            required
                            minlength="8"
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Min. 8 characters"
                        />
                    </div>
                </div>

                <!-- Confirm Password Input -->
                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock class="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            id="confirmPassword"
                            bind:value={confirmPassword}
                            required
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Re-enter password"
                        />
                    </div>
                    {#if !passwordsMatch}
                        <p class="mt-1 text-sm text-red-600">Passwords do not match</p>
                    {/if}
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
                    disabled={isLoading || !passwordsMatch}
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {#if isLoading}
                        <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Updating Password...
                    {:else}
                        Reset Password
                    {/if}
                </button>
            </form>
        </div>
    </div>
</div>
