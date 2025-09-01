<script>
    import { onMount } from 'svelte';
    import '../../../app.css';
    
    onMount(() => {
        setTimeout(() => {
            window.location.href = '/(no-layout)/org';
        }, 500); 
    });
</script>

<svelte:head>
    <title>Redirecting... | AWCRM</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
    <div class="text-center">
        <div class="mb-4">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto"></div>
        </div>
        <h2 class="text-xl text-white font-medium">Redirecting you to your dashboard...</h2>
        <p class="mt-2 text-blue-200">Please wait a moment</p>
    </div>
</div>