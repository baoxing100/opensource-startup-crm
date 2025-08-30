<script>
    export let data;
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
            {#if data.success}
                <div class="text-green-600 mb-4">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h1 class="text-2xl font-bold mb-2">Email Verified!</h1>
                    <p class="text-gray-600 mb-4">
                        Your email has been successfully verified. You can now access all features of BottleCRM.
                    </p>
                    <a 
                        href="/login" 
                        class="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Continue to Login
                    </a>
                </div>
            {:else}
                <div class="text-red-600 mb-4">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h1 class="text-2xl font-bold mb-2">Verification Failed</h1>
                    <p class="text-gray-600 mb-4">
                        {data.error || 'The verification link is invalid or has expired.'}
                    </p>
                    <div class="space-y-4">
                        <a 
                            href="/login" 
                            class="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Back to Login
                        </a>
                        <p class="text-sm text-gray-500">
                            Need a new verification link? 
                            <a href="/resend-verification" class="text-blue-600 hover:underline">
                                Click here
                            </a>
                        </p>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
